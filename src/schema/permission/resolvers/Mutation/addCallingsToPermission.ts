import { GraphQLError } from 'graphql';
import { RequestContext } from '../../../../context';
import type { MutationResolvers } from './../../../types.generated';
export const addCallingsToPermission: NonNullable<MutationResolvers['addCallingsToPermission']> = async (_parent, { input }, { dataSources, user }: RequestContext) => {
    if (!user?.sessionId) {
        throw new GraphQLError("User is unauthenticated");
    }

    return dataSources.permission().addCallingsToPermission(input);
};