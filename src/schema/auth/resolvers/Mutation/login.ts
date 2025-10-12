import { RequestContext } from '../../../../context';
import type { MutationResolvers } from './../../../types.generated';
import { safeAsync } from '../../../../utilities/safeAsync';
import { randomUUID } from 'crypto';

export const login: NonNullable<MutationResolvers['login']> = async (_parent, { input }, { dataSources }: RequestContext) => {
    const [credentialsError, token] = await safeAsync(dataSources.authentication().login(input));
    if (credentialsError) return {
        success: false,
        error: {
            code: "INVALID_CREDENTIALS",
            message: credentialsError.message
        }
    }
    
    const [error, user] = await safeAsync(dataSources.user().authenticatedUser(token));
    if (error || !user) return {
        success: false,
        error: {
            code: "USER_NOT_FOUND",
            message: error?.message || "Could not retrieve user details"
        }
    }

    const sessionId = randomUUID();
    const userSessionId = `${user.id}-${sessionId}`;
    await dataSources.surrealTokenStore().setUserToken(userSessionId, token);

    await dataSources.cookie().set({
        name: 'eb2ward-authenticated-user',
        value: userSessionId,
        expires: null,
    });

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        },
        success: true
    }
};