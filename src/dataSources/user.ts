import { Config } from "../config";
import { UserDto } from "../dtos/user";
import { User } from "../schema/types.generated";
import { SurrealHttpDataSource } from "./surrealHttp";

export class UserDataSource extends SurrealHttpDataSource {
    constructor(config: Config) {
        super(config);
    }

    authenticatedUser = async (token: string): Promise<User> => {
        const query = `SELECT * FROM ONLY $auth.id`;
        const response = await this.query<UserDto>({ query, token });

        return {
            __typename: "User",
            ...response
        }
    }
}