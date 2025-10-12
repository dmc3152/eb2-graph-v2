import { RequestContext } from '../../../../context';
import type { MutationResolvers } from './../../../types.generated';

export const createAppointment: NonNullable<MutationResolvers['createAppointment']> = async (_parent, _arg, { dataSources }: RequestContext) => {
    return dataSources.calendar().createAppointment({
        ..._arg.input,
        type: dataSources.appointmentDetails().getAppointmentTypeFromCode(_arg.input.type)?.name ?? _arg.input.type
    });
};