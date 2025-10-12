import { RequestContext } from '../../../../context';
import type { QueryResolvers } from './../../../types.generated';

export const allAvailabilityBlocks: NonNullable<QueryResolvers['allAvailabilityBlocks']> = async (_parent, _arg, { dataSources }: RequestContext) => {
    const allAvailabilityBlocks = await dataSources.calendar().getAllAvailabilityBlocks();
    return allAvailabilityBlocks;
};