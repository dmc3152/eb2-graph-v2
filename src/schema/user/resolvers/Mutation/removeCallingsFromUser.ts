import { GraphQLError } from 'graphql';
import { RequestContext } from '../../../../context';
import type { MutationResolvers } from './../../../types.generated';
import { safeAsync } from '../../../../utilities/safeAsync';
export const removeCallingsFromUser: NonNullable<MutationResolvers['removeCallingsFromUser']> = async (_parent, { userId, callingIds }, { dataSources, user }: RequestContext) => {
    if (!user?.sessionId) {
        throw new GraphQLError("User is unauthenticated");
    }

    const [error, result] = await safeAsync(dataSources.user().removeCallingsFromUser(userId, callingIds))
    if (error || !result) {
        return {
            __typename: 'CallingsAssignmentPayload',
            success: false,
            error: {
                code: 'UNKNOWN_ERROR',
                message: error?.message || "Could not remove callings from user"
            }
        }
    }

    return {
        __typename: 'CallingsAssignmentPayload',
        success: true
    }
};