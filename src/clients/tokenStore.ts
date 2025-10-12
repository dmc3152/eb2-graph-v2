import { DateTime } from "luxon";

export type TokenStoreType = "MachineUser" | "User";
export type TokenStore = Map<string, TokenEntry>;
export type TokenEntry = {
    token: string
    expiration?: DateTime<true>
}

export class TokenStoreClient {
    private tokenStores = new Map<TokenStoreType, TokenStore>([
        ["MachineUser", new Map<string, TokenEntry>()],
        ["User", new Map<string, TokenEntry>()]
    ]);

    constructor() { }

    get = (storeType: TokenStoreType, key: string): string | undefined => {
        const tokenStore = this.tokenStores.get(storeType);
        if (!tokenStore) throw new Error('Token store does not exist');

        const entry = tokenStore.get(key);
        if (!entry) return undefined;
        if (entry.expiration && entry.expiration < DateTime.now()) return undefined;

        return entry.token;
    }

    set = (storeType: TokenStoreType, key: string, entry: TokenEntry) => {
        const tokenStore = this.tokenStores.get(storeType);
        if (!tokenStore) throw new Error('Token store does not exist');

        tokenStore.set(key, entry);
    }

    delete = (storeType: TokenStoreType, key: string) => {
        const tokenStore = this.tokenStores.get(storeType);
        if (!tokenStore) throw new Error('Token store does not exist');

        tokenStore.delete(key);
    }
}