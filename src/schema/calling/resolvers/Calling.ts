import { RequestContext } from '../../../context';
import type { CallingResolvers } from './../../types.generated';
export const Calling: CallingResolvers = {
    assignedTo: async (_parent, _arg, { dataSources, user }: RequestContext) => {
        if (!user?.sessionId) {
            throw new Error("User is unauthenticated");
        }

        const callingId = _parent.id;
        const userDtos = await dataSources.user().getUsersCallingIsAssignedTo(callingId.toString());
        return userDtos;
    }
};