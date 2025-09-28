import { createYoga, createSchema } from 'graphql-yoga'
import { createServer } from 'http'
import { typeDefs } from './schema/typeDefs.generated'
import { resolvers } from './schema/resolvers.generated'
import { google } from 'googleapis'
import { buildContext, RequestContext } from './context'

const calendar = google.calendar('v3');
const auth = new google.auth.GoogleAuth({
    keyFile: './ewa-beach-2nd-ward-93dea61e9eab.json',
    scopes: [
        'https://www.googleapis.com/auth/calendar'
    ],
});

const yoga = createYoga({
  schema: createSchema<RequestContext>({ typeDefs, resolvers }),
  context: buildContext(calendar, auth)
});
const server = createServer(yoga);
server.listen(4000);
console.info('Server is running on https://studio.apollographql.com/sandbox/explorer?endpoint=http://localhost:4000/graphql');