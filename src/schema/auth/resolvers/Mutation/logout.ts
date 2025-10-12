import { RequestContext } from '../../../../context';
import type { MutationResolvers } from './../../../types.generated';

export const logout: NonNullable<MutationResolvers['logout']> = async (_parent, _arg, { dataSources, user }: RequestContext) => {
    if (user?.sessionId) {
        await dataSources.surrealTokenStore().deleteUserToken(user.sessionId);
    }

    await dataSources.cookie().delete('eb2ward-authenticated-user');

    return {
        success: true
    }
};