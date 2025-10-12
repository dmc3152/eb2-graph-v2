import { GraphQLError } from "graphql";

export class HttpDataSource {
    protected baseUrl: URL;

    constructor(baseUrl: string) {
        this.baseUrl = new URL(baseUrl);
    }

    protected buildUrl(path: string, params: Record<string, string> = {}): URL {
        const url = new URL(path, this.baseUrl);
        const merged = new URLSearchParams(url.searchParams);

        Object.entries(params).forEach(([k, v]) => {
            if (v == null) return;
            merged.set(k, v);
        });
        
        url.search = merged.toString();
        return url;
    }

    protected get = async <T>(path: string, params: Record<string, string> = {}, init?: Omit<RequestInit, "method">): Promise<T> => {
        const url = this.buildUrl(path, params);
        try {
            const response = await fetch(url, {
                ...init,
                method: 'GET',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...init?.headers },
            });
            if (!response.ok) throw new Error(`There was a problem with calling GET ${url.toString()}. Status: ${response.statusText}`);
            return await response.json() as T;
        }
        catch (error) {
            if (error instanceof Error) throw error;
            if (typeof error === 'string') throw new Error(error);
            throw new Error(`There was a problem with calling GET ${url.toString()}`);
        }
    }

    protected post = async <T>(path: string, body: any, init?: Omit<RequestInit, "method" | "body">): Promise<T> => {
        const url = this.buildUrl(path);
        try {
            const response = await fetch(url, {
                ...init,
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...init?.headers },
            });
            
            if (!response.ok) {
                const failedResult = await response.json();
                throw new GraphQLError(response.statusText, { extensions: { serverResponse: failedResult } });
            }
            
            return await response.json() as T;
        }
        catch (error) {
            if (error instanceof Error) throw error;
            if (typeof error === 'string') throw new Error(error);
            throw new Error(`There was a problem with calling POST ${url.toString()}`);
        }
    }

    protected put = async <T>(path: string, body: any, init?: Omit<RequestInit, "method" | "body">): Promise<T> => {
        const url = this.buildUrl(path);
        try {
            const response = await fetch(url, {
                ...init,
                method: 'PUT',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...init?.headers },
            });
            if (!response.ok) throw new Error(`There was a problem with calling PUT ${url.toString()}. Status: ${response.statusText}`);
            return await response.json() as T;
        }
        catch (error) {
            if (error instanceof Error) throw error;
            if (typeof error === 'string') throw new Error(error);
            throw new Error(`There was a problem with calling PUT ${url.toString()}`);
        }
    }

    protected delete = async <T>(path: string, body: any, init?: Omit<RequestInit, "method" | "body">): Promise<T> => {
        const url = this.buildUrl(path);
        try {
            const response = await fetch(url, {
                ...init,
                method: 'DELETE',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json', Accept: 'application/json', ...init?.headers },
            });
            if (!response.ok) throw new Error(`There was a problem with calling DELETE ${url.toString()}. Status: ${response.statusText}`);
            return await response.json() as T;
        }
        catch (error) {
            if (error instanceof Error) throw error;
            if (typeof error === 'string') throw new Error(error);
            throw new Error(`There was a problem with calling DELETE ${url.toString()}`);
        }
    }
}