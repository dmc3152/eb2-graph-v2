import { RequestContext } from '../../../../context';
import type { QueryResolvers } from './../../../types.generated';

export const availabilityBlocks: NonNullable<QueryResolvers['availabilityBlocks']> = async (_parent, _arg, { dataSources }: RequestContext) => {
    const blocks = await dataSources.calendar().getAvailabilityBlocks(_arg.bishopricMember);
    return blocks;
};