import { RequestContext } from '../../../../context';
import type { QueryResolvers } from './../../../types.generated';

export const allAppointmentTypes: NonNullable<QueryResolvers['allAppointmentTypes']> = async (_parent, _arg, _ctx: RequestContext) => {
    return _ctx.appointmentDetailsDataSource.getAllAppointmentTypes();
};