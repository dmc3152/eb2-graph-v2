import { GraphQLError } from 'graphql';
import { RequestContext } from '../../../context';
import type { CallingResolvers } from './../../types.generated';
export const Calling: CallingResolvers = {
    assignedTo: async (_parent, _arg, { dataSources, user }: RequestContext) => {
        if (!user?.sessionId) {
            throw new GraphQLError("User is unauthenticated");
        }

        const callingId = _parent.id;
        const userDtos = await dataSources.user().getUsersCallingIsAssignedTo(callingId.toString());
        return userDtos;
    },
    permissions: async (_parent, _arg, { dataSources, user }: RequestContext) => {
        if (!user?.sessionId) {
            throw new GraphQLError("User is unauthenticated");
        }

        const callingId = _parent.id;
        const permissionDtos = await dataSources.permission().getPermissionsAssignedToCalling(callingId.toString());
        return permissionDtos;
    }
};