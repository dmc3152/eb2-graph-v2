export class Config {
    surreal: {
        url: string,
        namespace: string,
        database: string
    }
    cookie: {
        domain: string,
        samesite: CookieSameSite
    }
    redisUrl: string
    email: {
        host: string
        user: string
        password: string
    }
    machineUserSecrets: {
        emailVerifier: string
        passwordReset: string
        triviaGame: string
    }
    uiUrl: string

    constructor() {
        this.surreal = {
            url: this._load("SURREAL_DB_URL"),
            namespace: this._load("SURREAL_DB_NAMESPACE"),
            database: this._load("SURREAL_DB_DATABASE")
        }
        this.cookie = {
            domain: this._loadOptional("COOKIE_DOMAIN") || "eb2ward.com",
            samesite: this._loadOptional("COOKIE_SAMESITE") as CookieSameSite || "strict"
        }
        this.redisUrl = this._loadOptional("REDIS_URL") || "redis://localhost:6379"
        this.email = {
            host: this._load("EMAIL_HOST"),
            user: this._load("EMAIL_USER"),
            password: this._load("EMAIL_PASS")
        }
        this.machineUserSecrets = {
            emailVerifier: this._load("EMAIL_VERIFIER_SECRET"),
            passwordReset: this._load("PASSWORD_RESET_SECRET"),
            triviaGame: this._load("TRIVIA_GAME_SECRET")
        }
        this.uiUrl = this._load("UI_URL")
    }
    
    private _load(key: string) {
        const value = process.env[key];
        if (!value) throw new Error(`Environment variable '${key}' is not set`);
        return value;
    }

    private _loadOptional(key: string) {
        const value = process.env[key];
        return value;
    }
}