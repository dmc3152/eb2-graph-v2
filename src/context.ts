import { CalendarDataSource } from "./dataSources/calendar"
import { AppointmentDetailsDataSource } from "./dataSources/appointmentDetails"
import { Config } from "./config"
import { createPubSub, YogaInitialContext } from "graphql-yoga"
import { EmailerDataSource } from "./dataSources/emailer"
import { CalendarClient } from "./clients/calendar"
import { EmailClient } from "./clients/email"
import { RedisClient } from "./clients/redis"
import { TokenStoreClient } from "./clients/tokenStore"
import { SurrealTokenStore } from "./dataSources/surrealTokenStore"
import { AuthenticationDataSource } from "./dataSources/authentication"
import { SurrealHttpDataSource } from "./dataSources/surrealHttp"
import { UserDataSource } from "./dataSources/user"
import { CookieDataSource } from "./dataSources/cookie"
import { SurrealUserClient } from "./clients/surrealUser"
import { SurrealMachineClient } from "./clients/surrealMachine"
import { TriviaClient } from "./clients/trivia"
import { TriviaGameDataSource } from "./dataSources/triviaGame"
import { CallingDataSource } from "./dataSources/calling"
import { PermissionDataSource } from "./dataSources/permission"

export interface Clients {
    calendar: CalendarClient
    email: EmailClient
    emailVerifier: SurrealMachineClient
    passwordReset: SurrealMachineClient
    pubsub: ReturnType<typeof createPubSub>
    redis: RedisClient
    tokenStore: TokenStoreClient
    trivia: TriviaClient
}

export interface RequestContext {
    config: Config
    dataSources: {
        appointmentDetails: () => AppointmentDetailsDataSource
        authentication: () => AuthenticationDataSource
        calendar: () => CalendarDataSource
        calling: () => CallingDataSource
        cookie: () => CookieDataSource
        emailer: () => EmailerDataSource
        permission: () => PermissionDataSource
        pubsub: ReturnType<typeof createPubSub>
        surrealHttp: () => SurrealHttpDataSource
        triviaGame: () => TriviaGameDataSource
        userTokenStore: () => SurrealTokenStore
        user: () => UserDataSource
    }
    params: YogaInitialContext['params']
    request: Request,
    user?: UserContext
}

export interface UserContext {
    sessionId?: string
    triviaGameSessionId?: string
}

type Newable<T, A extends any[] = any[]> = new (...args: A) => T;

const lazyLoad = <T, A extends any[] = any[]>(Constructor: Newable<T, A>, ...args: A): (() => T) => {
    let resource: T | undefined;
    return () => {
        if (resource === undefined) {
            resource = new Constructor(...args);
        }
        return resource;
    };
};

export const buildContext = (
    config: Config,
    clients: Clients
) => async ({ request, params }: YogaInitialContext): Promise<RequestContext> => {
    const surrealUserClient = new SurrealUserClient(config);

    const dataSources: RequestContext['dataSources'] = {
        appointmentDetails: lazyLoad(AppointmentDetailsDataSource, surrealUserClient),
        authentication: lazyLoad(AuthenticationDataSource, surrealUserClient, clients.emailVerifier, clients.passwordReset),
        calendar: lazyLoad(CalendarDataSource, clients.calendar),
        calling: lazyLoad(CallingDataSource, surrealUserClient),
        cookie: lazyLoad(CookieDataSource, request, config),
        emailer: lazyLoad(EmailerDataSource, clients.email, config),
        permission: lazyLoad(PermissionDataSource, surrealUserClient),
        pubsub: clients.pubsub,
        surrealHttp: lazyLoad(SurrealHttpDataSource, config),
        triviaGame: lazyLoad(TriviaGameDataSource, clients.trivia),
        userTokenStore: lazyLoad(SurrealTokenStore, clients.tokenStore, clients.redis),
        user: lazyLoad(UserDataSource, surrealUserClient)
    };

    if (params.operationName === 'IntrospectionQuery') {
        return {
            config,
            dataSources,
            params,
            request
        }
    }

    const authenticatedUserCookie = await dataSources.cookie().get('eb2ward-authenticated-user');
    const userSessionId = authenticatedUserCookie?.value;
    if (userSessionId) {
        const userToken = await dataSources.userTokenStore().getUserToken(userSessionId);
        if (userToken) await surrealUserClient.authenticate(userToken);
    }
    const triviaGameCookie = await dataSources.cookie().get('eb2ward-trivia-game');
    const triviaGameSessionId = triviaGameCookie?.value;

    return {
        config,
        dataSources,
        params,
        request,
        user: {
            sessionId: userSessionId,
            triviaGameSessionId
        }
    }
}