import Surreal, { ConnectionStatus } from "surrealdb";
import { Config } from "../config";
import { Credentials, SignUpDetails } from "../schema/types.generated";

export class SurrealClient {
    private db = new Surreal();

    constructor(private config: Config) { }

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

    async query<T extends unknown[]>({ query, token, params }: { query: string, token?: string, params?: Record<string, unknown> }): Promise<{ [K in keyof T]: T[K]; }> {
        const db = await this.connect();
        if (token) await db.authenticate(token);
        try {
            const result = await db.query<T>(query, params);
            return result;
        }
        catch (err) { throw err }
        finally { await db.invalidate() }
    }

    async signIn(variables: Credentials) {
        const db = await this.connect();
        try {
            const signInResponse = await db.signin({
                namespace: this.config.surreal.namespace,
                database: this.config.surreal.database,
                access: 'user',
                variables
            });
            return signInResponse;
        }
        catch (err) { throw err }
        finally { await db.invalidate() }
    }

    async signInMachine(variables: {key: string, secret: string}) {
        const db = await this.connect();
        try {
            const signInResponse = await db.signin({
                namespace: this.config.surreal.namespace,
                database: this.config.surreal.database,
                access: 'machine_user',
                variables
            });
            return signInResponse;
        }
        catch (err) { throw err }
        finally { await db.invalidate() }
    }

    async signUp(variables: SignUpDetails) {
        const db = await this.connect();
        try {
            const signUpResponse = await db.signup({
                namespace: this.config.surreal.namespace,
                database: this.config.surreal.database,
                access: 'user',
                variables
            });
            return signUpResponse;
        }
        catch (err) { throw err }
        finally { await db.invalidate() }
    }
}