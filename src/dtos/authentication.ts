export type PasswordResetDto = {
    expiration: string
    id: string
    secret: number
    user: string
}

export type SignInDto = {
    code: number
    details: string
    token: string
}
export type SignUpDto = SignInDto;

export type EmailVerificationQueryDto = {
    email: string
    email_verification: {
        expiration: string
        id: string
        secret: number
        verified: boolean
    }
}