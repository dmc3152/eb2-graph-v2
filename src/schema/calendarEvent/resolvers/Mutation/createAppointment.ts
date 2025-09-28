import { RequestContext } from '../../../../context';
import type { MutationResolvers } from './../../../types.generated';

export const createAppointment: NonNullable<MutationResolvers['createAppointment']> = async (_parent, _arg, _ctx: RequestContext) => {
    return _ctx.calendarDataSource.createAppointment({
        ..._arg.input,
        type: _ctx.appointmentDetailsDataSource.getAppointmentTypeFromCode(_arg.input.type)?.name ?? _arg.input.type
    });
};