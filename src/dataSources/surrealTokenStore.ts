import { decodeJwt } from "jose";
import { RedisClient } from "../clients/redis";
import { TokenStoreClient } from "../clients/tokenStore";
import { DateTime } from "luxon";
import { SetOptions } from "redis";

export class SurrealTokenStore {
    constructor(
        private tokenStore: TokenStoreClient,
        private redis: RedisClient,
    ) { }
    
    getPlayerName = async (triviaGameSessionId: string) => {
        const nameFromStore = this.tokenStore.get("PlayerName", triviaGameSessionId);
        if (nameFromStore) return nameFromStore;

        const key = triviaGameSessionId;
        const nameFromCache = await this.redis.get(key);
        if (nameFromCache) {
            await this.setPlayerName(triviaGameSessionId, nameFromCache, true);
        }
        return nameFromCache;
    }

    setPlayerName = async (triviaGameSessionId: string, playerName: string, skipCache: boolean = false) => {
        this.tokenStore.set("User", triviaGameSessionId, { value: playerName });

        if (skipCache) return;

        const options = this.setExpirationOption(DateTime.now().plus({ hours: 3 }));
        const key = triviaGameSessionId;
        await this.redis.set(key, playerName, options);
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
        this.tokenStore.set("User", userSessionId, { value: token });

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
}