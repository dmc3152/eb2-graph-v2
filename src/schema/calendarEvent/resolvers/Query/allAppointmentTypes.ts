import { GraphQLError } from 'graphql';
import { RequestContext } from '../../../../context';
import type { QueryResolvers } from './../../../types.generated';

export const allAppointmentTypes: NonNullable<QueryResolvers['allAppointmentTypes']> = async (_parent, _arg, { user, dataSources }: RequestContext) => {
    if (!user?.sessionId) {
        throw new GraphQLError("User is unauthenticated");
    }

    const token = await dataSources.surrealTokenStore().getUserToken(user.sessionId);
    if (!token) {
        throw new GraphQLError("User is unauthenticated");
    }

    return dataSources.appointmentDetails().getAllAppointmentTypes(token);
};