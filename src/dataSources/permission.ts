import { StringRecordId } from "surrealdb";
import { SurrealUserClient } from "../clients/surrealUser";
import { Permission, PermissionSearch } from "../schema/types.generated";
import { PermissionDto } from "../dtos/permission";
import { PageInfoDto } from "../dtos/pageInfo";
import { PermissionMapper } from "../schema/permission/schema.mappers";

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