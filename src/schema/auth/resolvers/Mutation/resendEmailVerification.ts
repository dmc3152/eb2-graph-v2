import { RequestContext } from '../../../../context';
import { safeAsync } from '../../../../utilities/safeAsync';
import type { MutationResolvers } from './../../../types.generated';
import { DateTime } from 'luxon';

export const resendEmailVerification: NonNullable<MutationResolvers['resendEmailVerification']> = async (_parent, { email }, { config, dataSources }: RequestContext) => {
    const emailVerifierToken = await dataSources.surrealTokenStore().getMachineToken("email_verifier");
    if (!emailVerifierToken) return {
        success: false,
        error: {
            code: "EMAIL_VERIFIER_AUTHENTICATION_FAILED",
            message: "Email verifier could not authenticate to database"
        }
    }

    const [verificationError, isEmailVerified] = await safeAsync(dataSources.authentication().isEmailVerified(emailVerifierToken, { email }));
    if (verificationError) return {
        success: false,
        error: {
            code: "NOT_FOUND",
            message: "Could not retrieve email details"
        }
    }
    if (isEmailVerified) return {
        success: false,
        error: {
            code: "EMAIL_ALREADY_VERIFIED",
            message: "The email address has already been verified"
        }
    }

    const [error, emailVerificationDetails] = await safeAsync(dataSources.authentication().getEmailVerificationRecord(emailVerifierToken, { email }));
    if (error) return {
        success: false,
        error: {
            code: "NOT_FOUND",
            message: "Could not retrieve email details"
        }
    }

    const expiration = DateTime.fromISO(emailVerificationDetails.expiration);
    const isExpired = DateTime.now() > expiration;
    let code = emailVerificationDetails.secret;
    let verifyEmailUrl = `${config.uiUrl}/auth/verifyEmail?code=${code}&email=${encodeURIComponent(email)}`;

    if (isExpired) {
        const [updateError, details] = await safeAsync(dataSources.authentication().refreshEmailVerification(emailVerifierToken, { id: emailVerificationDetails.id }));
        if (updateError) return {
            success: false,
            error: {
                code: "COULD_NOT_UPDATE",
                message: "Could not update email details"
            }
        }
        code = details.secret;
        verifyEmailUrl = `${config.uiUrl}/auth/verifyEmail?code=${code}&email=${encodeURIComponent(email)}`;
    }
    const emailOptions: Record<string, string> = {
        to: email,
        subject: "Email Verification for EB2 Ward",
        text: `Your email code is ${code}. It will expire in 15 minutes. Please enter the code at the following link: ${verifyEmailUrl}`,
        html: `
            <p>Below is your email code. It will expire in 15 minutes.</p>
            <h2>${code}</h2>
            <p>Please click the link below or copy and paste it into your browser:</p>
            <a href="${verifyEmailUrl}">${verifyEmailUrl}</a>
        `
    };

    const [emailSendError, emailSuccess] = await safeAsync(dataSources.emailer().sendEmail(emailOptions));
    if (emailSendError) return {
        success: false,
        error: {
            code: "EMAIL_ERROR",
            message: "Could not send the email"
        }
    }

    return {
        success: true
    }
};