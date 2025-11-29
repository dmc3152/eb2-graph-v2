import { GraphQLError } from 'graphql';
import { RequestContext } from '../../../../context';
import type { QueryResolvers } from './../../../types.generated';
import { safeAsync } from '../../../../utilities/safeAsync';
export const users: NonNullable<QueryResolvers['users']> = async (_parent, { input }, { dataSources, user }: RequestContext) => {
    if (!user?.sessionId) {
        throw new GraphQLError("User is unauthenticated");
    }

    const [error, usersResult] = await safeAsync(dataSources.user().searchUsers(input));
    if (error || !usersResult) throw new GraphQLError(error?.message || "Could not retrieve users");

    const [users, pageInfo] = usersResult;
    return {
        __typename: "UserConnection",
        edges: users.map(user => ({ node: user })),
        pageInfo
    };
};