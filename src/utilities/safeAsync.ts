export const safeAsync = async <T>(promise: Promise<T>): Promise<[Error, undefined] | [undefined, T]> => {
    try {
        const result = await promise;
        return [undefined, result];
    }
    catch (error) {
        if (error instanceof Error) return [error, undefined];
        if (typeof error === 'string') return [new Error(error), undefined];
        return [new Error(JSON.stringify(error)), undefined];
    }
}