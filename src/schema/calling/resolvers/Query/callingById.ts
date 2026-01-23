import { GraphQLError } from 'graphql';
import { RequestContext } from '../../../../context';
import type { QueryResolvers } from './../../../types.generated';
export const callingById: NonNullable<QueryResolvers['callingById']> = async (_parent, { id }, { dataSources, user }: RequestContext) => {
    if (!user?.sessionId) {
        throw new GraphQLError("User is unauthenticated");
    }

    return dataSources.calling().getCallingById(id);
};