import { StringRecordId } from "surrealdb";
import { SurrealUserClient } from "../clients/surrealUser";
import { PermissionCallings, PermissionCreate, PermissionDeletePayload, PermissionErrorCode, PermissionRemoveCallingsPayload, PermissionSearch } from "../schema/types.generated";
import { PermissionDto } from "../dtos/permission";
import { PageInfoDto } from "../dtos/pageInfo";
import { PermissionAssociateCallingsPayloadMapper, PermissionMapper, PermissionPayloadMapper } from "../schema/permission/schema.mappers";
import { safeAsync } from "../utilities/safeAsync";
import { CallingDto } from "../dtos/calling";

export class PermissionDataSource {
    constructor(private surreal: SurrealUserClient) { }

    async searchPermissions(input?: PermissionSearch | null): Promise<[PermissionMapper[], PageInfoDto]> {
        const whereClause = `
            ($nameContains = NULL OR string::contains(string::lowercase(name), string::lowercase($nameContains))) AND
            ($callingIsOneOf = NULL OR array::any(callings[WHERE $callingIsOneOf CONTAINS id])) AND
            ($callingIsNotOneOf = NULL OR !array::any(callings[WHERE $callingIsNotOneOf CONTAINS id]))
        `;

        const query = `
            SELECT * FROM permission
            WHERE ${whereClause}
            ORDER BY name ASC
            LIMIT $limit
            START $offset
            FETCH callings;

            LET $count = SELECT count() as totalCount
            FROM ONLY permission
            WHERE ${whereClause}
            GROUP ALL;

            RETURN {
                totalCount: $count.totalCount ?? 0,
                pageSize: $limit,
                pageOffset: $offset,
                hasNextPage: ($count.totalCount > ($offset + $limit))
            };
        `;
        
        const params = {
            limit: input?.paging?.limit ?? 20,
            offset: input?.paging?.offset ?? 0,
            nameContains: input?.filters?.nameContains ?? null,
            callingIsOneOf: input?.filters?.callingIsOneOf ? input.filters.callingIsOneOf.map(record => new StringRecordId(record)) : null,
            callingIsNotOneOf: input?.filters?.callingIsNotOneOf ? input.filters.callingIsNotOneOf.map(record => new StringRecordId(record)) : null,
        };
        const [permissionDtos, _, pageInfoDto] = await this.surreal.query<[PermissionDto[], undefined, PageInfoDto]>({ query, params });
        return [permissionDtos.map(permissionDto => this._mapPermissionDtoToPermission(permissionDto)), pageInfoDto];
    }
    
    async getPermissionsAssignedToCalling(callingId: string): Promise<PermissionMapper[]> {
        const query = `
            SELECT * FROM permission
            WHERE array::intersect(callings, [$callingId])
            FETCH callings;
        `;
        const params = { callingId: new StringRecordId(callingId) };
        const [permissionDtos] = await this.surreal.query<[PermissionDto[]]>({ query, params });
        return permissionDtos.map(permissionDto => this._mapPermissionDtoToPermission(permissionDto));
    }

    async createPermission({ name, callings }: PermissionCreate): Promise<PermissionPayloadMapper> {
        const safeName = name.trim();
        if (safeName.length === 0) {
            return {
                __typename: "PermissionPayload",
                permission: null,
                success: false,
                error: {
                    code: "INVALID_PERMISSION_NAME",
                    message: "Permission name cannot be empty"
                }
            }
        }

        if (safeName.match(/[^a-zA-Z0-9 _-]/)) {
            return {
                __typename: "PermissionPayload",
                permission: null,
                success: false,
                error: {
                    code: "INVALID_PERMISSION_NAME",
                    message: "Permission name contains invalid characters"
                }
            }
        }

        const id = `permission:${safeName.toLowerCase().replace(/\s+/g, '_')}`;
        const callingIds = callings?.map(id => new StringRecordId(id)) ?? [];
        const query = `
            CREATE ONLY permission
            CONTENT {
                id: $id,
                name: $name,
                callings: $callings
            };

            SELECT *
            FROM ONLY $id
            FETCH callings;
        `;
        const params = { id: new StringRecordId(id), name: safeName, callings: callingIds };
        const [error, result] = await safeAsync(this.surreal.query<[any, PermissionDto]>({ query, params }));
        if (error) {
            const code: PermissionErrorCode = error.message.includes("already exists") ? "PERMISSION_ALREADY_EXISTS" : "UNEXPECTED_ERROR";
            return {
                __typename: "PermissionPayload",
                permission: null,
                success: false,
                error: {
                    code: code,
                    message: error.message
                }
            }
        }
        const [_, permissionDto] = result;
        return {
            __typename: "PermissionPayload",
            permission: this._mapPermissionDtoToPermission(permissionDto),
            success: true,
            error: null
        };
    }

    async deletePermission(id: string): Promise<PermissionDeletePayload> {
        const query = `
            DELETE ONLY $id RETURN BEFORE;
        `;
        const params = { id: new StringRecordId(id) };
        const [error] = await safeAsync(this.surreal.query<[PermissionDto]>({ query, params }));
        if (error?.message.includes("Expected a single result")) {
            return {
                __typename: "PermissionDeletePayload",
                success: false,
                error: {
                    code: "PERMISSION_NOT_FOUND",
                    message: "The specified permission does not exist"
                }
            }
        }
        return {
            __typename: "PermissionDeletePayload",
            success: !error,
            error: error ? {
                code: "UNEXPECTED_ERROR",
                message: error.message
            } : null
        };
    }

    async addCallingsToPermission({ permissionId, callingIds }: PermissionCallings): Promise<PermissionAssociateCallingsPayloadMapper> {
        const query = `
            UPDATE ONLY permission
            SET callings += $callingIds
            WHERE id = $permissionId;

            SELECT *
            FROM $callingIds;
        `;
        const params = {
            permissionId: new StringRecordId(permissionId),
            callingIds: callingIds.map(id => new StringRecordId(id))
        };
        const [error, result] = await safeAsync(this.surreal.query<[any, CallingDto[]]>({ query, params }));
        if (error) {
            return {
                __typename: "PermissionAssociateCallingsPayload",
                callings: [],
                success: false,
                error: {
                    code: "UNEXPECTED_ERROR",
                    message: error.message
                }
            }
        }
        const [_, callingDtos] = result;
        return {
            __typename: "PermissionAssociateCallingsPayload",
            callings: callingDtos.map(callingDto => ({
                __typename: "Calling",
                ...callingDto,
                id: callingDto.id.toString(),
            })),
            success: true,
            error: null
        };
    }

    async removeCallingsFromPermission({ permissionId, callingIds }: PermissionCallings): Promise<PermissionRemoveCallingsPayload> {
        const query = `
            UPDATE ONLY permission
            SET callings -= $callingIds
            WHERE id = $permissionId;
        `;
        const params = {
            permissionId: new StringRecordId(permissionId),
            callingIds: callingIds.map(id => new StringRecordId(id))
        };
        const [error, result] = await safeAsync(this.surreal.query<[PermissionDto]>({ query, params }));
        if (error) {
            return {
                __typename: "PermissionRemoveCallingsPayload",
                success: false,
                error: {
                    code: "UNEXPECTED_ERROR",
                    message: error.message
                }
            }
        }
        return {
            __typename: "PermissionRemoveCallingsPayload",
            success: true,
            error: null
        };
    }

    private _mapPermissionDtoToPermission = (permissionDto: PermissionDto): PermissionMapper => ({
        __typename: "Permission",
        id: permissionDto.id.toString(),
        name: permissionDto.name,
        callings: permissionDto.callings.map(callingDto => ({
            __typename: "Calling",
            ...callingDto,
            id: callingDto.id.toString(),
        }))
    });
}