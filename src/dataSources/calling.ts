import { SurrealClient } from "../clients/surreal";
import { Config } from "../config";
import { CallingDto } from "../dtos/calling";
import { SurrealHttpDataSource } from "./surrealHttp";

export class CallingDataSource extends SurrealHttpDataSource {
    constructor(protected config: Config, private surreal: SurrealClient) {
        super(config);
    }

    async listCallings() {
        const [response] = await this.surreal.query<[CallingDto[]]>({
            query: `
                SELECT * FROM calling
            `,
        });
        return response;
    }
}