import { DateTime } from 'luxon';
import { RequestContext } from '../../../../context';
import { safeAsync } from '../../../../utilities/safeAsync';
import type { MutationResolvers } from './../../../types.generated';

export const resetPassword: NonNullable<MutationResolvers['resetPassword']> = async (_parent, { input }, { dataSources, user }: RequestContext) => {
    const passwordResetAgentToken = await dataSources.surrealTokenStore().getMachineToken("password_reset");
    if (!passwordResetAgentToken) return {
        success: false,
        error: {
            code: "PASSWORD_RESET_AGENT_AUTHENTICATION_FAILED",
            message: "Password reset agent could not authenticate to database"
        }
    }

    const [error, passwordResetDetails] = await safeAsync(dataSources.authentication().getPasswordResetRecord(passwordResetAgentToken, { email: input.email }));
    if (error || !passwordResetDetails) return {
        success: false,
        error: {
            code: "NOT_FOUND",
            message: "Could not retrieve password reset details"
        }
    }

    const expiration = DateTime.fromISO(passwordResetDetails.expiration);
    const isExpired = DateTime.now() > expiration;

    if (isExpired) return {
        success: false,
        error: {
            code: "CODE_EXPIRED",
            message: "The code has expired"
        }
    }

    if (input.code !== passwordResetDetails.secret) return {
        success: false,
        error: {
            code: "CODE_INVALID",
            message: "The code is invalid"
        }
    }

    const [updateError, updateSuccess] = await safeAsync(dataSources.authentication().resetPassword(passwordResetAgentToken, { id: passwordResetDetails.user, password: input.password }));
    if (updateError) return {
        success: false,
        error: {
            code: "RESET_ERROR",
            message: "Could not reset the password"
        }
    }

    const [deleteError, deleteSuccess] = await safeAsync(dataSources.authentication().deleteResetPasswordRecord(passwordResetAgentToken, { id: passwordResetDetails.id }));
    if (deleteError) return {
        success: true,
        error: {
            code: "DELETE_ERROR",
            message: "Could not delete the reset password request"
        }
    }

    if (user?.sessionId) {
        await dataSources.surrealTokenStore().deleteUserToken(user.sessionId);
    }

    await dataSources.cookie().delete('eb2ward-authenticated-user');

    return {
        success: true
    }
};