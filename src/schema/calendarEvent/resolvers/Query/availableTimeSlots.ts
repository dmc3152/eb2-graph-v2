import { RequestContext } from '../../../../context';
import type { QueryResolvers } from './../../../types.generated';

export const availableTimeSlots: NonNullable<QueryResolvers['availableTimeSlots']> = async (_parent, _arg, _ctx: RequestContext) => {
    const availableTimeSlots = await _ctx.calendarDataSource.getAvailableTimeSlots(_arg.bishopricMember, _arg.durationInMinutes);
    return availableTimeSlots;
};