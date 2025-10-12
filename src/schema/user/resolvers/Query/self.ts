import { RequestContext } from '../../../../context';
import type { QueryResolvers } from './../../../types.generated';
import { safeAsync } from '../../../../utilities/safeAsync';
import { GraphQLError } from 'graphql';

export const self: NonNullable<QueryResolvers['self']> = async (_parent, _arg, { dataSources, user }: RequestContext) => {
    if (!user?.sessionId) {
        throw new GraphQLError("User is unauthenticated");
    }

    const token = await dataSources.surrealTokenStore().getUserToken(user.sessionId);
    if (!token) {
        throw new GraphQLError("User is unauthenticated");
    }

    const [error, authenticatedUser] = await safeAsync(dataSources.user().authenticatedUser(token));
    if (error || !authenticatedUser) throw new GraphQLError(error?.message || "Could not retrieve user details");

    return authenticatedUser;
};