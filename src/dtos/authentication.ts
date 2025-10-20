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

export type EmailVerificationDto = {
    expiration: string
    id: string
    secret: number
    user: string
}