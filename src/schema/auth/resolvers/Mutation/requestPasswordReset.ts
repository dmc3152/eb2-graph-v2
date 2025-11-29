import { RequestContext } from '../../../../context';
import { safeAsync } from '../../../../utilities/safeAsync';
import type { MutationResolvers } from './../../../types.generated';

export const requestPasswordReset: NonNullable<MutationResolvers['requestPasswordReset']> = async (_parent, { email }, { config, dataSources }: RequestContext) => {
    const [error, passwordResetDetails] = await safeAsync(dataSources.authentication().getPasswordResetRecord({ email }));
    if (error) return {
        success: false,
        error: {
            code: "UNKNOWN_ERROR",
            message: "Could not retrieve password reset details"
        }
    }

    let code: number;
    if (passwordResetDetails) {
        const [updateError, record] = await safeAsync(dataSources.authentication().refreshPasswordReset({ id: passwordResetDetails.id }));
        if (updateError) return {
            success: false,
            error: {
                code: "COULD_NOT_UPDATE",
                message: "Could not update password reset request"
            }
        }
        code = record.secret;
    }
    else {
        const [createError, createResult] = await safeAsync(dataSources.authentication().createPasswordResetRecord({ email }));
        if (createError) return {
            success: false,
            error: {
                code: createError.message === "NOT_FOUND" ? createError.message : "COULD_NOT_CREATE",
                message: "Could not create password reset request"
            }
        }
        code = createResult.secret;
    }

    const resetPasswordUrl = `${config.uiUrl}/auth/resetPassword?code=${code}&email=${encodeURIComponent(email)}`;
    const [emailSendError, emailSuccess] = await safeAsync(dataSources.emailer().sendEmail({
        to: email,
        subject: "Reset Password Code for EB2 Ward",
        text: `Your password reset code is ${code}. It will expire in 15 minutes. Please enter the code at the following link to reset your password: ${resetPasswordUrl}`,
        html: `
            <p>Below is your password reset code. It will expire in 15 minutes.</p>
            <h2>${code}</h2>
            <p>Please click the link below or copy and paste it into your browser to reset your password:</p>
            <a href="${resetPasswordUrl}">${resetPasswordUrl}</a>
        `,
    }));
    if (emailSendError) return {
        success: false,
        error: {
            code: "EMAIL_ERROR",
            message: "Could not send the reset password email"
        }
    }

    return {
        success: true
    }
};