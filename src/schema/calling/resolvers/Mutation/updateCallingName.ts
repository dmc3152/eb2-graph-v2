import { GraphQLError } from 'graphql';
import { RequestContext } from '../../../../context';
import type { MutationResolvers } from './../../../types.generated';
import { safeAsync } from '../../../../utilities/safeAsync';
export const updateCallingName: NonNullable<MutationResolvers['updateCallingName']> = async (_parent, { id, name }, { dataSources, user }: RequestContext) => {
    if (!user?.sessionId) {
        throw new GraphQLError("User is unauthenticated");
    }

    const [error, result] = await safeAsync(dataSources.calling().updateCallingName(id, name));
    if (error || !result) {
        return {
            __typename: 'CallingPayload',
            success: false,
            errors: [{
                code: 'UNKNOWN_ERROR',
                message: error?.message || "Could not update calling name"
            }]
        }
    }

    return {
        __typename: 'CallingPayload',
        success: true,
        calling: result
    }
};