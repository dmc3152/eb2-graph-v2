import { QueryResult } from "surrealdb";
import { Config } from "../config";
import { HttpDataSource } from "./http";
import { GraphQLError } from "graphql";
import { JSONResolver } from "graphql-scalars";

export class SurrealHttpDataSource extends HttpDataSource {
    constructor(protected config: Config) {
        super(config.surreal.url);
    }

    protected query = async <T>({ query, token, params, init }: { query: string, token?: string, params?: Record<string, string>, init?: Omit<RequestInit, "method" | "body"> }): Promise<T> => {
        const url = this.buildUrl('/sql', params);
        try {
            const response = await fetch(url, {
                ...init,
                method: 'POST',
                body: query,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json',
                    'Surreal-NS': this.config.surreal.namespace,
                    'Surreal-DB': this.config.surreal.database,
                    ...init?.headers,
                    'Authorization': token
                        ? `Bearer ${token}`
                        : (typeof init?.headers === 'object' && !Array.isArray(init.headers) && !(init.headers instanceof Headers)
                            ? (init.headers as Record<string, string>)['Authorization']
                            : "")
                },
            });

            const jsonResult = await response.json() as QueryResult<T>[];
            jsonResult.forEach(res => {
                if (res.status === "ERR") throw new GraphQLError(`There was a problem with querying SurrealDB. Status: ${response.statusText}`, { extensions: { serverResponse: res } });
            });

            if (jsonResult.length === 1) {
                return jsonResult[0].result as T;
            }

            return jsonResult.map(res => res.result) as T;
        }
        catch (error) {
            if (error instanceof Error) throw error;
            if (typeof error === 'string') throw new Error(error);
            throw new Error(`There was a problem with querying SurrealDB.`);
        }
    }
}