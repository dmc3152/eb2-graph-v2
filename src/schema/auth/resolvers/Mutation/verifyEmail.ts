import { DateTime } from 'luxon';
import { RequestContext } from '../../../../context';
import { safeAsync } from '../../../../utilities/safeAsync';
import type { MutationResolvers } from './../../../types.generated';

export const verifyEmail: NonNullable<MutationResolvers['verifyEmail']> = async (_parent, { email, code }, { dataSources }: RequestContext) => {
    const [error, emailVerificationDetails] = await safeAsync(dataSources.authentication().getEmailVerificationRecord({ email }));
    if (error || !emailVerificationDetails) return {
        success: false,
        error: {
            code: "NOT_FOUND",
            message: "Could not retrieve email details"
        }
    }

    const expiration = DateTime.fromISO(emailVerificationDetails.expiration);
    const isExpired = DateTime.now() > expiration;

    if (isExpired) return {
        success: false,
        error: {
            code: "CODE_EXPIRED",
            message: "The code has expired"
        }
    }

    if (code !== emailVerificationDetails.secret) return {
        success: false,
        error: {
            code: "CODE_INVALID",
            message: "The code is invalid"
        }
    }

    const [updateError, updateSuccess] = await safeAsync(dataSources.authentication().verifyEmail({ id: emailVerificationDetails.user }));
    if (updateError) return {
        success: false,
        error: {
            code: "UNKNOWN_ERROR",
            message: "Could not set email as verified"
        }
    }

    const [deleteError, deleteSuccess] = await safeAsync(dataSources.authentication().deleteEmailVerificationRecord({ id: emailVerificationDetails.id }));
    if (deleteError) return {
        success: true,
        error: {
            code: "DELETE_ERROR",
            message: "Could not delete the email verification record"
        }
    }

    return {
        success: true
    };
};