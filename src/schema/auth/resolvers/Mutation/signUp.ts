import { RequestContext } from '../../../../context';
import { safeAsync } from '../../../../utilities/safeAsync';
import type { MutationResolvers } from './../../../types.generated';

export const signUp: NonNullable<MutationResolvers['signUp']> = async (_parent, { input }, { config, dataSources }: RequestContext) => {
    const minLength = 8;
    if (input.password.length < minLength) {
        return {
            success: false,
            error: {
                code: "INVALID_PASSWORD_LENGTH",
                message: `The password must have at least ${minLength} characters`
            }
        }
    }

    if (!/[A-Z]/.test(input.password)) {
        return {
            success: false,
            error: {
                code: "MISSING_CAPITAL_LETTER",
                message: "The password must have at least 1 capital letter"
            }
        }
    }

    if (!/[a-z]/.test(input.password)) {
        return {
            success: false,
            error: {
                code: "MISSING_LOWERCASE_LETTER",
                message: "The password must have at least 1 lowercase letter"
            }
        }
    }

    if (!/\d/.test(input.password)) {
        return {
            success: false,
            error: {
                code: "MISSING_NUMBER",
                message: "The password must have at least 1 number"
            }
        }
    }

    if (/\s/.test(input.password)) {
        return {
            success: false,
            error: {
                code: "INVALID_PASSWORD_CHARACTER",
                message: "The password has at least one invalid character"
            }
        }
    }

    const success = await dataSources.authentication().signUp(input);
    if (!success) return {
        success: false,
        error: {
            code: "INVALID_CREDENTIALS",
            message: "Could not sign up the user"
        }
    }

    const emailVerifierToken = await dataSources.surrealTokenStore().getMachineToken("email_verifier");
    if (!emailVerifierToken) return {
        success: false,
        error: {
            code: "EMAIL_VERIFIER_AUTHENTICATION_FAILED",
            message: "Email verifier could not authenticate to database"
        }
    }

    const [error, emailVerificationDetails] = await safeAsync(dataSources.authentication().createEmailVerificationRecord(emailVerifierToken, { email: input.email }));
    if (error) return {
        success: false,
        error: {
            code: "NOT_FOUND",
            message: "Could not retrieve user details"
        }
    }

    const code = emailVerificationDetails.secret;
    const verifyEmailUrl = `${config.uiUrl}/auth/verifyEmail?code=${code}&email=${encodeURIComponent(input.email)}`;
    const [emailError, emailSuccess] = await safeAsync(dataSources.emailer().sendEmail({
        to: input.email,
        subject: "Email Verification for EB2 Ward",
        text: `Your email code is ${code}. It will expire in 15 minutes. Please enter the code at the following link: ${verifyEmailUrl}`,
        html: `
            <p>Below is your email code. It will expire in 15 minutes.</p>
            <h2>${code}</h2>
            <p>Please click the link below or copy and paste it into your browser:</p>
            <a href="${verifyEmailUrl}">${verifyEmailUrl}</a>
        `
    }));
    if (emailError) {
        return {
            success: true,
            error: {
                code: "EMAIL_ERROR",
                message: "There was a problem sending the verification email"
            }
        }
    }

    return {
        success: true
    }
};