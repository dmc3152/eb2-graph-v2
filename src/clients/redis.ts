import { createClient, RedisClientType, SetOptions } from "redis";
import { Config } from "../config";
import { safeAsync } from "../utilities/safeAsync";
import { withTimeout } from "../utilities/withTimeout";

export class RedisClient {
    private client: RedisClientType;

    constructor(private config: Config) {
        this.client = createClient({
            url: this.config.redisUrl
        });

        this.client.on('error', (err) => {
            console.error('Redis Client Error', err);
        });
        
        this.client.on('connect', async () => {
            const [error, success] = await safeAsync(withTimeout(this.client.ping(), 250))
            if (error) {
                this.disconnect();
            }
        });
    }

    async connect() {
        if (this.client.isOpen) return;

        await this.client.connect();
    }

    disconnect() {
        this.client.close();
    }

    async get(key: string): Promise<string | undefined> {
        await this.connect();
        const [error, value] = await safeAsync(withTimeout(this.client.get(key), 500));
        return value || undefined;
    }

    async set(key: string, value: string, options?: SetOptions) {
        await this.connect();
        const [error, result] = await safeAsync(this.client.set(key, value, options));
        return result || undefined;
    }

    async delete(key: string) {
        await this.connect();
        const [error, result] = await safeAsync(this.client.del(key));
        return result;
    }
}