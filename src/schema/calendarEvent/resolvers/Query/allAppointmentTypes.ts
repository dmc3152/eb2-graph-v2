import { GraphQLError } from 'graphql';
import { RequestContext } from '../../../../context';
import type { QueryResolvers } from './../../../types.generated';

export const allAppointmentTypes: NonNullable<QueryResolvers['allAppointmentTypes']> = async (_parent, _arg, { dataSources }: RequestContext) => {
    return dataSources.appointmentDetails().getAllAppointmentTypes();
};