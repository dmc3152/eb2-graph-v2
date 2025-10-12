export const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
    let timerId: NodeJS.Timeout;

    const timeoutPromise = new Promise((_, reject) => {
        timerId = setTimeout(() => {
            const error = new Error(`Redis command timed out after ${ms}ms.`);
            reject(error);
        }, ms);
    });

    return Promise.race([
        promise,
        timeoutPromise
    ]).finally(() => {
        clearTimeout(timerId);
    }) as Promise<T>;
}