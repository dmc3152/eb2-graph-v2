import { RedisClientType } from "redis";
import { safeAsync } from "../utilities/safeAsync";
import { withTimeout } from "../utilities/withTimeout";

export class RedisDataSource {
    constructor(private client: RedisClientType) {}
    
    async get(key: string): Promise<string | undefined> {
        const [error, value] = await safeAsync(withTimeout(this.client.get(key), 1000));
        return value || undefined;
    }

    async set(key: string, value: string) {
        const [error, result] = await safeAsync(this.client.set(key, value));
        return result || undefined;
    }

    async delete(key: string) {
        const [error, result] = await safeAsync(this.client.del(key));
        return result;
    }
}