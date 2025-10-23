import { CalendarDataSource } from "./dataSources/calendar"
import { AppointmentDetailsDataSource } from "./dataSources/appointmentDetails"
import { Config } from "./config"
import Surreal from "surrealdb"
import { YogaInitialContext } from "graphql-yoga"
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

export interface Clients {
    calendar: CalendarClient
    email: EmailClient
    redis: RedisClient
    tokenStore: TokenStoreClient
}

export interface RequestContext {
    config: Config
    dataSources: {
        appointmentDetails: () => AppointmentDetailsDataSource
        authentication: () => AuthenticationDataSource
        calendar: () => CalendarDataSource
        cookie: () => CookieDataSource
        emailer: () => EmailerDataSource
        surrealHttp: () => SurrealHttpDataSource
        surrealTokenStore: () => SurrealTokenStore
        user: () => UserDataSource
    }
    params: YogaInitialContext['params']
    request: Request,
    user?: UserContext
}

export interface UserContext {
    sessionId?: string
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
    const dataSources: RequestContext['dataSources'] = {
        appointmentDetails: lazyLoad(AppointmentDetailsDataSource, config),
        authentication: lazyLoad(AuthenticationDataSource, config),
        calendar: lazyLoad(CalendarDataSource, clients.calendar),
        cookie: lazyLoad(CookieDataSource, request, config),
        emailer: lazyLoad(EmailerDataSource, clients.email, config),
        surrealHttp: lazyLoad(SurrealHttpDataSource, config),
        surrealTokenStore: lazyLoad(SurrealTokenStore, config, clients.tokenStore, clients.redis),
        user: lazyLoad(UserDataSource, config)
    };

    if (params.operationName === 'IntrospectionQuery') {
        return {
            config,
            dataSources,
            params,
            request
        }
    }

    const cookie = await dataSources.cookie().get('eb2ward-authenticated-user');
    const userSessionId = cookie?.value;

    return {
        config,
        dataSources,
        params,
        request,
        user: {
            sessionId: userSessionId
        }
    }
}