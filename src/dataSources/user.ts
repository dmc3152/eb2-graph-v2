import { StringRecordId } from "surrealdb";
import { SurrealUserClient } from "../clients/surrealUser";
import { PageInfoDto } from "../dtos/pageInfo";
import { UserDto } from "../dtos/user";
import { User, UserSearch } from "../schema/types.generated";

export class UserDataSource {
    constructor(private surreal: SurrealUserClient) { }

    authenticatedUser = async (): Promise<User> => {
        const query = `SELECT * FROM ONLY $auth.id FETCH callings`;
        const [response] = await this.surreal.query<[UserDto]>({ query });
        return this._mapUserDtoToUser(response);
    }

    searchUsers = async (input?: UserSearch | null): Promise<[User[], PageInfoDto]> => {
        const fieldMap = {
            FIRST_NAME: "first_name",
            LAST_NAME: "last_name",
            EMAIL: "email",
            IS_EMAIL_VERIFIED: "is_email_verified",
            IS_SITE_ADMIN: "is_site_admin"
        };

        const orderBy = input?.sorting?.map(sort => {
            const direction = sort.direction === "DESC" ? "DESC" : "ASC";
            return `${fieldMap[sort.field]} ${direction}`;
        }).join(", ") || "firstName ASC, lastName ASC";

        const whereClause = `
            ($firstNameContains = NULL OR string::contains(string::lowercase(first_name), string::lowercase($firstNameContains))) AND
            ($lastNameContains = NULL OR string::contains(string::lowercase(last_name), string::lowercase($lastNameContains))) AND
            ($emailContains = NULL OR string::contains(string::lowercase(email), string::lowercase($emailContains))) AND
            ($isEmailVerified = NULL OR is_email_verified = $isEmailVerified) AND
            ($isSiteAdmin = NULL OR is_site_admin = $isSiteAdmin) AND
            ($hasCalling = NULL OR ($hasCalling = TRUE AND array::any(callings)) OR ($hasCalling = FALSE AND array::len(callings) = 0)) AND
            ($callingIsOneOf = NULL OR array::any(callings[WHERE $callingIsOneOf CONTAINS id]))
        `;

        const query = `
            SELECT * FROM user
            WHERE ${whereClause}
            ORDER BY ${orderBy}
            LIMIT $limit
            START $offset
            FETCH callings;

            LET $count = SELECT count() as totalCount
            FROM ONLY user
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
            firstNameContains: input?.filters?.firstNameContains ?? null,
            lastNameContains: input?.filters?.lastNameContains ?? null,
            emailContains: input?.filters?.emailContains ?? null,
            isEmailVerified: input?.filters?.isEmailVerified ?? null,
            isSiteAdmin: input?.filters?.isSiteAdmin ?? null,
            hasCalling: input?.filters?.hasCalling ?? null,
            callingIsOneOf: input?.filters?.callingIsOneOf ? input.filters.callingIsOneOf.map(record => new StringRecordId(record)) : null
        };
        const [userDtos, _, pageInfoDto] = await this.surreal.query<[UserDto[], undefined, PageInfoDto]>({ query, params });
        return [userDtos.map(userDto => this._mapUserDtoToUser(userDto)), pageInfoDto];
    }

    private _mapUserDtoToUser = (userDto: UserDto): User => ({
        __typename: "User",
        id: userDto.id.toString(),
        firstName: userDto.first_name,
        lastName: userDto.last_name,
        email: userDto.email,
        isSiteAdmin: userDto.is_site_admin,
        callings: userDto.callings.map(callingDto => ({
            __typename: "Calling",
            ...callingDto,
            id: callingDto.id.toString(),
        }))
    });
}