import { DateTime } from 'luxon';
import { RequestContext } from '../../../../context';
import { safeAsync } from '../../../../utilities/safeAsync';
import type { MutationResolvers } from './../../../types.generated';

export const resetPassword: NonNullable<MutationResolvers['resetPassword']> = async (_parent, { input }, { dataSources, user }: RequestContext) => {
    const [error, passwordResetDetails] = await safeAsync(dataSources.authentication().getPasswordResetRecord({ email: input.email }));
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

    const [updateError, updateSuccess] = await safeAsync(dataSources.authentication().resetPassword({ id: passwordResetDetails.user, password: input.password }));
    if (updateError) return {
        success: false,
        error: {
            code: "RESET_ERROR",
            message: "Could not reset the password"
        }
    }

    const [deleteError, deleteSuccess] = await safeAsync(dataSources.authentication().deleteResetPasswordRecord({ id: passwordResetDetails.id }));
    if (deleteError) return {
        success: true,
        error: {
            code: "DELETE_ERROR",
            message: "Could not delete the reset password request"
        }
    }

    if (user?.sessionId) {
        await dataSources.userTokenStore().deleteUserToken(user.sessionId);
    }

    await dataSources.cookie().delete('eb2ward-authenticated-user');

    return {
        success: true
    }
};