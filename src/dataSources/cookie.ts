import type { CookieListItem } from '@whatwg-node/cookie-store';
import { Config } from '../config';

export class CookieDataSource {
    constructor(private request: Request, private config: Config) {
        if (!request.cookieStore) throw new Error("Cookies are not configured properly");
    }

    get = async (init?: string | CookieStoreGetOptions | undefined) => {
        return this.request.cookieStore?.get(init);
    }

    set = async (init: Omit<CookieListItem, "domain" | "httpOnly" | "secure" | "sameSite">, possibleValue?: string) => {
        return this.request.cookieStore?.set({
            domain: this.config.cookie.domain,
            httpOnly: true,
            secure: true,
            sameSite: this.config.cookie.samesite,
            ...init
        }, possibleValue);
    }

    delete = async (name: string) => {
        return this.set({
            name,
            expires: 0,
        })
    }
}