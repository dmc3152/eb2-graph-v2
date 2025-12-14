import { GraphQLError } from 'graphql';
import { RequestContext } from '../../../../context';
import type { QueryResolvers } from './../../../types.generated';
import { safeAsync } from '../../../../utilities/safeAsync';
export const callings: NonNullable<QueryResolvers['callings']> = async (_parent, { input }, { dataSources, user }: RequestContext) => {
    if (!user?.sessionId) {
        throw new GraphQLError("User is unauthenticated");
    }

    const [error, callingsResult] = await safeAsync(dataSources.calling().searchCallings(input));
    if (error || !callingsResult) throw new GraphQLError(error?.message || "Could not retrieve callings");

    const [callings, pageInfo] = callingsResult;
    return {
        __typename: "CallingConnection",
        edges: callings.map(calling => ({ node: calling })),
        pageInfo
    };
};