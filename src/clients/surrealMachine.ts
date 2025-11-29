import Surreal, { ConnectionStatus } from "surrealdb";
import { Config } from "../config";

export class SurrealMachineClient {
    private db = new Surreal();
    private hasSession = false;

    constructor(private config: Config, private machineCredentials: { key: string, secret: string }) {}

    private async connect(): Promise<Surreal> {
        if (this.db.status === ConnectionStatus.Connected) {
            return this.db;
        }

        try {
            await this.db.connect(this.config.surreal.url);
            await this.db.use({ namespace: this.config.surreal.namespace, database: this.config.surreal.database });
            return this.db;
        }
        catch (error) {
            console.error("Failed to connect to SurrealDB:", error instanceof Error ? error.message : String(error));
            await this.db.close();
            throw error;
        }
    }

    async query<T extends unknown[]>({ query, params }: { query: string, params?: Record<string, unknown> }): Promise<{ [K in keyof T]: T[K]; }> {
        const db = await this.connect();
        if (!this.hasSession) await this.signInMachine(this.machineCredentials);
        try {
            const result = await db.query<T>(query, params);
            return result;
        }
        catch (err) { throw err }
    }

    async signInMachine(variables: { key: string, secret: string }) {
        const db = await this.connect();
        try {
            const signInResponse = await db.signin({
                namespace: this.config.surreal.namespace,
                database: this.config.surreal.database,
                access: 'machine_user',
                variables
            });
            this.hasSession = true;
            return signInResponse;
        }
        catch (err) { throw err }
    }
}