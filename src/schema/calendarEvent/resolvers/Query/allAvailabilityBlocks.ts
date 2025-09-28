import { RequestContext } from '../../../../context';
import type { QueryResolvers } from './../../../types.generated';

export const allAvailabilityBlocks: NonNullable<QueryResolvers['allAvailabilityBlocks']> = async (_parent, _arg, _ctx: RequestContext) => {
    const allAvailabilityBlocks = await _ctx.calendarDataSource.getAllAvailabilityBlocks();
    return allAvailabilityBlocks;
};