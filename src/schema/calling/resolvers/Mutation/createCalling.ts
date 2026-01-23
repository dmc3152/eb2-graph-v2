import { GraphQLError } from 'graphql';
import { RequestContext } from '../../../../context';
import type { MutationResolvers } from './../../../types.generated';
import { safeAsync } from '../../../../utilities/safeAsync';
export const createCalling: NonNullable<MutationResolvers['createCalling']> = async (_parent, { input }, { dataSources, user }: RequestContext) => {
    if (!user?.sessionId) {
        throw new GraphQLError("User is unauthenticated");
    }

    const [createError, createResult] = await safeAsync(dataSources.calling().createCalling(input.name));
    if (createError || !createResult) {
        return {
            __typename: 'CreateCallingPayload',
            success: false,
            error: [{
                code: 'NAME_ALREADY_EXISTS',
                message: createError?.message || "Could not create calling"
            }]
        }
    }

    const userAssignments = await Promise.allSettled((input.assignedTo || []).map(async (userId) => {
        return dataSources.user().assignCallingsToUser(userId, [createResult.id.toString()]);
    }));

    const permissionAssignments = await Promise.allSettled((input.permissions || []).map(async (permissionId) => {
        return dataSources.permission().addCallingsToPermission({ permissionId, callingIds: [createResult.id.toString()] });
    }));

    return {
        __typename: 'CreateCallingPayload',
        success: true,
        calling: createResult,
        errors: userAssignments
            .filter(result => result.status === 'rejected')
            .map((result) => ({
                code: 'USER_ASSIGNMENT_FAILED',
                message: result.reason || "Failed to assign calling to user"
            }))
            .concat(
                permissionAssignments
                .filter(result => result.status === 'rejected')
                .map((result) => ({
                    code: 'PERMISSION_ASSIGNMENT_FAILED',
                    message: result.reason || "Failed to assign calling to permission"
                }))
            )
    }
};