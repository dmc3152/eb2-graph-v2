import { DateTime } from "luxon";
import { Config } from "../config";
import { Credentials, SignUpDetails } from "../schema/types.generated";
import { SurrealHttpDataSource } from "./surrealHttp";
import { GraphQLError } from "graphql";
import { SignInDto, SignUpDto, PasswordResetDto, EmailVerificationQueryDto } from "../dtos/authentication";

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

    getEmailVerificationRecord = async (token: string, params: { email: string }) => {
        const response = await this.query<EmailVerificationQueryDto[]>({
            query: `
                SELECT email, email_verification.*
                FROM User
                WHERE email = $email
                LIMIT 1;
            `,
            params,
            token
        });
        
        return response[0];
    }

    refreshEmailVerification = async (token: string, params: { id: string }) => {
        const newExpiration = DateTime.now().plus({ hours: 1 }).toISO();
        const newSecret = `${this.randomSixDigitNumber()}`;
        const response = await this.query<EmailVerificationQueryDto["email_verification"]>({
            query: `
                UPDATE ONLY $id
                SET expiration = <datetime> $expiration,
                secret = $secret,
                verified = false
            `,
            params: { ...params, expiration: newExpiration, secret: newSecret },
            token
        });

        return response;
    }

    verifyEmail = async (token: string, params: { id: string }) => {
        const response = await this.query<EmailVerificationQueryDto["email_verification"]>({
            query: `
                UPDATE ONLY $id
                SET verified = true;
            `,
            params: { ...params },
            token
        });

        return response;
    }

    getPasswordResetRecord = async (token: string, params: { email: string }) => {
        const response = await this.query<PasswordResetDto[]>({
            query: `
                SELECT * FROM Password_Reset
                WHERE user.email = $email
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
        const userResponse = await this.query<{ id: string }[]>({
            query: `
                SELECT id FROM User WHERE email = $email LIMIT 1;
            `,
            params,
            token
        });

        if (userResponse.length === 0) throw new Error("NOT_FOUND");

        const response = await this.query<PasswordResetDto>({
            query: `
                CREATE ONLY Password_Reset CONTENT { user: $id }
            `,
            params: { id: userResponse[0].id },
            token
        });

        return response;
    }

    resetPassword = async (token: string, params: { id: string, password: string }) => {
        const response = await this.query<PasswordResetDto>({
            query: `
                UPDATE ONLY $id
                SET password = crypto::argon2::generate($password);
            `,
            params,
            token
        });

        return response;
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