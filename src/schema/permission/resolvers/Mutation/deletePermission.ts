import { GraphQLError } from 'graphql';
import { RequestContext } from '../../../../context';
import type { MutationResolvers } from './../../../types.generated';
export const deletePermission: NonNullable<MutationResolvers['deletePermission']> = async (_parent, { id }, { dataSources, user }: RequestContext) => {
    if (!user?.sessionId) {
        throw new GraphQLError("User is unauthenticated");
    }

    return dataSources.permission().deletePermission(id);
};