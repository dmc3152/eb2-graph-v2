import { DateTime } from "luxon";
import { Config } from "../config";
import { Credentials, SignUpDetails } from "../schema/types.generated";
import { SurrealHttpDataSource } from "./surrealHttp";
import { GraphQLError } from "graphql";
import { SignInDto, SignUpDto, PasswordResetDto, EmailVerificationDto } from "../dtos/authentication";

export class AuthenticationDataSource extends SurrealHttpDataSource {
    constructor(protected config: Config) {
        super(config);
    }

    login = async (credentials: Credentials): Promise<string> => {
        const signInDto = await this.post<SignInDto>('/signin', {
            ns: this.config.surreal.namespace,
            db: this.config.surreal.database,
            ac: 'user',
            ...credentials
        });
        
        return signInDto.token;
    }

    signUp = async (signUpDetails: SignUpDetails) => {
        try {
            const signUpDto = await this.post<SignUpDto>('/signup', {
                ns: this.config.surreal.namespace,
                db: this.config.surreal.database,
                ac: 'user',
                ...signUpDetails
            });
            return !!signUpDto;
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

    createEmailVerificationRecord = async (token: string, params: { email: string }) => {
        const userResponse = await this.query<{ id: string }>({
            query: `
                SELECT id FROM ONLY User WHERE email = string::lowercase($email) LIMIT 1;
            `,
            params,
            token
        });
        
        const response = await this.query<EmailVerificationDto>({
            query: `
                CREATE ONLY Email_Verification CONTENT { user: $id }
            `,
            params: { id: userResponse.id },
            token
        });
        
        return response;
    }

    isEmailVerified = async (token: string, params: { email: string }) => {
        const response = await this.query<{ is_email_verified: boolean }>({
            query: `
                SELECT is_email_verified
                FROM ONLY User
                WHERE email = string::lowercase($email)
                LIMIT 1;
            `,
            params,
            token
        });

        return response.is_email_verified;
    }

    getEmailVerificationRecord = async (token: string, params: { email: string }) => {
        const response = await this.query<EmailVerificationDto | null>({
            query: `
                SELECT *
                FROM ONLY Email_Verification
                WHERE user.email = string::lowercase($email)
                LIMIT 1;
            `,
            params,
            token
        });
        
        return response;
    }

    refreshEmailVerification = async (token: string, params: { id: string }) => {
        const newExpiration = DateTime.now().plus({ hours: 1 }).toISO();
        const newSecret = `${this.randomSixDigitNumber()}`;
        const response = await this.query<EmailVerificationDto>({
            query: `
                UPDATE ONLY $id
                SET expiration = <datetime> $expiration,
                secret = $secret
            `,
            params: { ...params, expiration: newExpiration, secret: newSecret },
            token
        });

        return response;
    }

    verifyEmail = async (token: string, params: { id: string }) => {
        const response = await this.query<{ is_email_verified: boolean }>({
            query: `
                UPDATE ONLY $id
                SET is_email_verified = true
                RETURN is_email_verified;
            `,
            params: { ...params },
            token
        });

        return response.is_email_verified;
    }

    deleteEmailVerificationRecord = async (token: string, params: { id: string }) => {
        const response = await this.query<EmailVerificationDto>({
            query: `
                DELETE ONLY $id RETURN BEFORE;
            `,
            params,
            token
        });

        return response;
    }

    getPasswordResetRecord = async (token: string, params: { email: string }) => {
        const response = await this.query<PasswordResetDto[]>({
            query: `
                SELECT * FROM Password_Reset
                WHERE user.email = string::lowercase($email)
            `,
            params,
            token
        });
        return response[0];
    }

    private randomSixDigitNumber(): number {
        return Math.floor(Math.random() * 900_000) + 100_000;
    }

    refreshPasswordReset = async (token: string, params: { id: string }) => {
        const newExpiration = DateTime.now().plus({ minutes: 15 }).toISO();
        const newSecret = `${this.randomSixDigitNumber()}`;
        const response = await this.query<PasswordResetDto>({
            query: `
                UPDATE ONLY $id
                SET expiration = <datetime> $expiration,
                secret = $secret
            `,
            params: { ...params, expiration: newExpiration, secret: newSecret },
            token
        });
        
        return response;
    }

    createPasswordResetRecord = async (token: string, params: { email: string }) => {
        const userResponse = await this.query<{ id: string }>({
            query: `
                SELECT id FROM ONLY User WHERE email = string::lowercase($email) LIMIT 1;
            `,
            params,
            token
        });

        const response = await this.query<PasswordResetDto>({
            query: `
                CREATE ONLY Password_Reset CONTENT { user: $id }
            `,
            params: { id: userResponse.id },
            token
        });

        return response;
    }

    resetPassword = async (token: string, params: { id: string, password: string }) => {
        const response = await this.query<[]>({
            query: `
                UPDATE $id
                SET password = crypto::argon2::generate($password)
                RETURN NONE;
            `,
            params,
            token
        });

        return Array.isArray(response);
    }

    deleteResetPasswordRecord = async (token: string, params: { id: string }) => {
        const response = await this.query<PasswordResetDto>({
            query: `
                DELETE ONLY $id RETURN BEFORE;
            `,
            params,
            token
        });

        return response;
    }
}