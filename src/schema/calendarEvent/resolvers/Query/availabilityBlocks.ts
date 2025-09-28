import { RequestContext } from '../../../../context';
import type { QueryResolvers } from './../../../types.generated';

export const availabilityBlocks: NonNullable<QueryResolvers['availabilityBlocks']> = async (_parent, _arg, _ctx: RequestContext) => {
    const blocks = await _ctx.calendarDataSource.getAvailabilityBlocks(_arg.bishopricMember);
    return blocks;
};