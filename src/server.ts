import { createYoga, createSchema, Plugin, YogaInitialContext } from 'graphql-yoga'
import { createServer } from 'http'
import { typeDefs } from './schema/typeDefs.generated'
import { resolvers } from './schema/resolvers.generated'
import { buildContext, Clients, RequestContext } from './context'
import { Config } from './config'
import { useCookies } from '@whatwg-node/server-plugin-cookies'
import { RedisClient } from './clients/redis'
import { TokenStoreClient } from './clients/tokenStore'
import { EmailClient } from './clients/email'
import { CalendarClient } from './clients/calendar'

const config = new Config();

const clients: Clients = {
  calendar: new CalendarClient(),
  email: new EmailClient(config),
  redis: new RedisClient(config),
  tokenStore: new TokenStoreClient()
}

// const finalizeRequest = async (context: RequestContext) => {
//   const { dataSources } = context;
//   await dataSources.surreal().invalidate();
// }

// const finalizationPlugin: Plugin<YogaInitialContext, RequestContext> = {
//   onResultProcess({ serverContext }) {
//     if (serverContext.params.operationName === 'IntrospectionQuery') return;
//     finalizeRequest(serverContext);
//   },
// };

const yoga = createYoga({
  // cors: {
  //   origin: 'https://studio.apollographql.com',
  //   credentials: true
  // },
  schema: createSchema<RequestContext>({
    typeDefs, 
    resolvers
  }),
  context: buildContext(config, clients),
  plugins: [useCookies()]
});
const server = createServer(yoga);
server.listen(4000);
console.info('Server is running on https://studio.apollographql.com/sandbox/explorer?endpoint=http://localhost:4000/graphql');