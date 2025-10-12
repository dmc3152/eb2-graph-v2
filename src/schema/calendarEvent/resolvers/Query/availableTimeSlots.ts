import { RequestContext } from '../../../../context';
import type { QueryResolvers } from './../../../types.generated';

export const availableTimeSlots: NonNullable<QueryResolvers['availableTimeSlots']> = async (_parent, _arg, { dataSources }: RequestContext) => {
    const availableTimeSlots = await dataSources.calendar().getAvailableTimeSlots(_arg.bishopricMember, _arg.durationInMinutes);
    return availableTimeSlots;
};