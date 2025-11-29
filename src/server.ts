import { createYoga, createSchema, Plugin, YogaInitialContext, createPubSub } from 'graphql-yoga'
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
import { SurrealMachineClient } from './clients/surrealMachine'
import { TriviaClient } from './clients/trivia'

const config = new Config();

const triviaSurrealClient = new SurrealMachineClient(config, { key: 'trivia_game', secret: config.machineUserSecrets.triviaGame });
const pubsub = createPubSub();

const clients: Clients = {
  calendar: new CalendarClient(),
  email: new EmailClient(config),
  emailVerifier: new SurrealMachineClient(config, { key: 'email_verifier', secret: config.machineUserSecrets.emailVerifier }),
  passwordReset: new SurrealMachineClient(config, { key: 'password_reset', secret: config.machineUserSecrets.passwordReset }),
  pubsub,
  redis: new RedisClient(config),
  tokenStore: new TokenStoreClient(),
  trivia: new TriviaClient(triviaSurrealClient, pubsub)
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