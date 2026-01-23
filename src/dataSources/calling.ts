import { StringRecordId } from "surrealdb";
import { SurrealUserClient } from "../clients/surrealUser";
import { CallingDto } from "../dtos/calling";
import { PageInfoDto } from "../dtos/pageInfo";
import { CallingMapper } from "../schema/calling/schema.mappers";
import { CallingSearch } from "../schema/types.generated";

export class CallingDataSource {
    constructor(private surreal: SurrealUserClient) {}

    async searchCallings(input?: CallingSearch | null): Promise<[CallingMapper[], PageInfoDto]> {
        const whereClause = `
            ($nameContains = NULL OR string::contains(string::lowercase(name), string::lowercase($nameContains))) AND
            ($isAssigned = NULL OR ($isAssigned = TRUE AND (SELECT * FROM user WHERE array::intersect(callings, [$parent.id]))) OR ($isAssigned = FALSE AND !(SELECT * FROM user WHERE array::intersect(callings, [$parent.id]))))
        `;

        const query = `
            SELECT * FROM calling
            WHERE ${whereClause}
            ORDER BY name ASC
            LIMIT $limit
            START $offset
            FETCH callings;

            LET $count = SELECT count() as totalCount
            FROM ONLY calling
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
            isAssigned: input?.filters?.isAssigned ?? null,
        };
        const [callingDtos, _, pageInfoDto] = await this.surreal.query<[CallingDto[], undefined, PageInfoDto]>({ query, params });
        return [callingDtos.map(callingDto => this._mapCallingDtoToCalling(callingDto)), pageInfoDto];
    }

    private _mapCallingDtoToCalling = (callingDto: CallingDto): CallingMapper => ({
        __typename: "Calling",
        id: callingDto.id.toString(),
        name: callingDto.name,
    });

    async getCallingById(id: string): Promise<CallingMapper | null> {
        const query = `
            SELECT * FROM ONLY $id;
        `;
        const params = { id: new StringRecordId(id) };
        const [callingDto] = await this.surreal.query<[CallingDto]>({ query, params });
        return callingDto ? this._mapCallingDtoToCalling(callingDto) : null;
    }

    async createCalling(name: string): Promise<CallingMapper> {
        const normalizedName = name.trim();
        const normalizedId = normalizedName.toLowerCase().replace(/\s+/g, '_');
        const id = new StringRecordId(`calling:${normalizedId}`);
        const query = `
            CREATE calling
            SET id = $id, name = $name;
        `;
        const [callingDto] = await this.surreal.query<[CallingDto]>({ query, params: { id, name } });
        return this._mapCallingDtoToCalling(callingDto);
    }

    async updateCallingName(id: string, name: string): Promise<CallingMapper> {
        const query = `
            UPDATE $id
            SET name = $name;
        `;
        const [callingDto] = await this.surreal.query<[CallingDto]>({ query, params: { id, name } });
        return this._mapCallingDtoToCalling(callingDto);
    }

    // async getCallingsForUser(userId: string): Promise<CallingMapper[]> {
    //     const query = `
    //         SELECT * FROM calling WHERE id IN (SELECT callings FROM user WHERE id = $userId);
    //     `;
    //     const params = { userId: new StringRecordId(userId) };
    //     const callingDtos = await this.surreal.query<[CallingDto]>({ query, params });
    //     return callingDtos.map(callingDto => this._mapCallingDtoToCalling(callingDto));
    // }
}