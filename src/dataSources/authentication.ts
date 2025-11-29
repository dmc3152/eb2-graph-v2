import { DateTime } from "luxon";
import { Credentials, SignUpDetails } from "../schema/types.generated";
import { GraphQLError } from "graphql";
import { PasswordResetDto, EmailVerificationDto } from "../dtos/authentication";
import { SurrealUserClient } from "../clients/surrealUser";
import { StringRecordId } from "surrealdb";
import { SurrealMachineClient } from "../clients/surrealMachine";

export class AuthenticationDataSource {
    constructor(private surreal: SurrealUserClient, private emailVerifier: SurrealMachineClient, private passwordResetAgent: SurrealMachineClient) { }

    login = async (credentials: Credentials): Promise<string> => {
        const token = await this.surreal.signIn(credentials);
        return token;
    }

    signUp = async (signUpDetails: SignUpDetails) => {
        try {
            const token = await this.surreal.signUp(signUpDetails);
            return !!token;
        }
        catch (error) {
            if (
                error instanceof GraphQLError &&
                error.extensions &&
                typeof error.extensions.serverResponse === 'object' &&
                error.extensions.serverResponse !== null &&
                'information' in error.extensions.serverResponse &&
                typeof (error.extensions.serverResponse as { information?: unknown }).information === 'string' &&
                ((error.extensions.serverResponse as { information: string }).information.includes("No record was returned"))
            ) return true;
        }
        return false;
    }

    createEmailVerificationRecord = async (params: { email: string }) => {
        const [userResponse] = await this.emailVerifier.query<[{ id: string }]>({
            query: `
                SELECT id FROM ONLY user WHERE email = string::lowercase($email) LIMIT 1;
            `,
            params
        });
        
        const [response] = await this.emailVerifier.query<[EmailVerificationDto]>({
            query: `
                CREATE ONLY email_verification CONTENT { user: $id }
            `,
            params: { id: new StringRecordId(userResponse.id) }
        });
        
        return response;
    }

    isEmailVerified = async (params: { email: string }) => {
        const [response] = await this.emailVerifier.query<[{ is_email_verified: boolean }]>({
            query: `
                SELECT is_email_verified
                FROM ONLY user
                WHERE email = string::lowercase($email)
                LIMIT 1;
            `,
            params
        });

        return response.is_email_verified;
    }

    getEmailVerificationRecord = async (params: { email: string }) => {
        const [response] = await this.emailVerifier.query<[EmailVerificationDto | null]>({
            query: `
                SELECT *
                FROM ONLY email_verification
                WHERE user.email = string::lowercase($email)
                LIMIT 1;
            `,
            params
        });
        
        return response;
    }

    refreshEmailVerification = async (params: { id: string }) => {
        const newExpiration = DateTime.now().plus({ hours: 1 }).toISO();
        const newSecret = `${this.randomSixDigitNumber()}`;
        const [response] = await this.emailVerifier.query<[EmailVerificationDto]>({
            query: `
                UPDATE ONLY $id
                SET expiration = <datetime> $expiration,
                secret = $secret
            `,
            params: { id: new StringRecordId(params.id), expiration: newExpiration, secret: newSecret }
        });

        return response;
    }

    verifyEmail = async (params: { id: string }) => {
        const [response] = await this.emailVerifier.query<[{ is_email_verified: boolean }]>({
            query: `
                UPDATE ONLY $id
                SET is_email_verified = true
                RETURN is_email_verified;
            `,
            params: { id: new StringRecordId(params.id) }
        });

        return response.is_email_verified;
    }

    deleteEmailVerificationRecord = async (params: { id: string }) => {
        const [response] = await this.emailVerifier.query<[EmailVerificationDto]>({
            query: `
                DELETE ONLY $id RETURN BEFORE;
            `,
            params: { id: new StringRecordId(params.id) }
        });

        return response;
    }

    getPasswordResetRecord = async (params: { email: string }) => {
        const [response] = await this.passwordResetAgent.query<[PasswordResetDto]>({
            query: `
                SELECT * FROM ONLY password_reset
                WHERE user.email = string::lowercase($email)
                LIMIT 1;
            `,
            params
        });
        return response;
    }

    private randomSixDigitNumber(): number {
        return Math.floor(Math.random() * 900_000) + 100_000;
    }

    refreshPasswordReset = async (params: { id: string }) => {
        const newExpiration = DateTime.now().plus({ minutes: 15 }).toISO();
        const newSecret = `${this.randomSixDigitNumber()}`;
        const [response] = await this.passwordResetAgent.query<[PasswordResetDto]>({
            query: `
                UPDATE ONLY $id
                SET expiration = <datetime> $expiration,
                secret = $secret
            `,
            params: { id: new StringRecordId(params.id), expiration: newExpiration, secret: newSecret }
        });
        
        return response;
    }

    createPasswordResetRecord = async (params: { email: string }) => {
        const [userResponse] = await this.passwordResetAgent.query<[{ id: string }]>({
            query: `
                SELECT id FROM ONLY user WHERE email = string::lowercase($email) LIMIT 1;
            `,
            params
        });

        const [response] = await this.passwordResetAgent.query<[PasswordResetDto]>({
            query: `
                CREATE ONLY password_reset CONTENT { user: $id }
            `,
            params: { id: new StringRecordId(userResponse.id) }
        });

        return response;
    }

    resetPassword = async (params: { id: string, password: string }) => {
        const [response] = await this.passwordResetAgent.query<[[]]>({
            query: `
                UPDATE $id
                SET password = crypto::argon2::generate($password)
                RETURN NONE;
            `,
            params: { id: new StringRecordId(params.id), password: params.password }
        });

        return Array.isArray(response);
    }

    deleteResetPasswordRecord = async (params: { id: string }) => {
        const [response] = await this.passwordResetAgent.query<[PasswordResetDto]>({
            query: `
                DELETE ONLY $id RETURN BEFORE;
            `,
            params: { id: new StringRecordId(params.id) }
        });

        return response;
    }
}