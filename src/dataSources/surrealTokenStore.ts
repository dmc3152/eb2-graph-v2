import { decodeJwt } from "jose";
import { RedisClient } from "../clients/redis";
import { TokenStoreClient } from "../clients/tokenStore";
import { Config } from "../config";
import { safeAsync } from "../utilities/safeAsync";
import { DateTime } from "luxon";
import { SetOptions } from "redis";
import { SurrealClient } from "../clients/surreal";

export type MachineUser = "email_verifier" | "password_reset"

export class SurrealTokenStore {
    private readonly machineCredentials: Record<MachineUser, string>;

    constructor(
        private config: Config,
        private tokenStore: TokenStoreClient,
        private redis: RedisClient,
        private surreal: SurrealClient
    ) {
        this.machineCredentials = {
            email_verifier: this.config.machineUserSecrets.emailVerifier,
            password_reset: this.config.machineUserSecrets.passwordReset
        }
    }

    getUserToken = async (userSessionId: string) => {
        const tokenFromStore = this.tokenStore.get("User", userSessionId);
        if (tokenFromStore) return tokenFromStore;

        const key = `${userSessionId}-token`;
        const tokenFromCache = await this.redis.get(key);
        if (tokenFromCache) {
            await this.setUserToken(userSessionId, tokenFromCache, true);
        }
        return tokenFromCache;
    }

    setUserToken = async (userSessionId: string, token: string, skipCache: boolean = false) => {
        const expiration = this.extractExpirationFromToken(token);
        this.tokenStore.set("User", userSessionId, { token });

        if (skipCache) return;

        const options = this.setExpirationOption(expiration);
        const key = `${userSessionId}-token`;
        await this.redis.set(key, token, options);
    }

    deleteUserToken = async (userSessionId: string) => {
        this.tokenStore.delete("User", userSessionId);
        const key = `${userSessionId}-token`;
        await this.redis.delete(key);
    }

    getMachineToken = async (machineUser: MachineUser) => {
        const tokenFromStore = this.tokenStore.get("MachineUser", machineUser);
        if (tokenFromStore) return tokenFromStore;

        const tokenFromCache = await this.redis.get(`MachineUser:${machineUser}`);
        if (tokenFromCache) {
            await this.setMachineToken(machineUser, tokenFromCache, true);
            return tokenFromCache;
        }

        const [error, tokenFromSurreal] = await safeAsync(this.machineLogin(machineUser));
        if (tokenFromSurreal) {
            await this.setMachineToken(machineUser, tokenFromSurreal);
        }
        return tokenFromSurreal;
    }

    setMachineToken = async (machineUser: MachineUser, token: string, skipCache: boolean = false) => {
        const expiration = this.extractExpirationFromToken(token);
        this.tokenStore.set("MachineUser", machineUser, { token, expiration });

        if (skipCache) return;

        const options = this.setExpirationOption(expiration);
        await this.redis.set(`MachineUser:${machineUser}`, token, options);
    }

    private extractExpirationFromToken = (token: string) => {
        const decodedToken = decodeJwt(token);
        if (!decodedToken.exp) return undefined;

        const expiration = DateTime.fromSeconds(decodedToken.exp);
        if (expiration.isValid) return expiration;

        return undefined;
    }

    private setExpirationOption = (expiration?: DateTime<true>): SetOptions | undefined => {
        if (!expiration) return undefined;

        const ttl = Math.floor(expiration.toSeconds() - DateTime.now().toSeconds());
        return {
            expiration: {
                type: "EX",
                value: ttl
            }
        };
    }

    private machineLogin = async (key: MachineUser): Promise<string> => {
        const token = await this.surreal.signInMachine({
            key,
            secret: this.machineCredentials[key]
        });
        return token;
    }
}