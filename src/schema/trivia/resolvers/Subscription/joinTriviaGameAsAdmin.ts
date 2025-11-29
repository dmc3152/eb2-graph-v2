import { GraphQLError } from 'graphql';
import { RequestContext } from '../../../../context';
import { safeAsync } from '../../../../utilities/safeAsync';
import type { SubscriptionResolvers, TriviaGameUpdateForAdmin } from './../../../types.generated';
export const joinTriviaGameAsAdmin: NonNullable<SubscriptionResolvers['joinTriviaGameAsAdmin']> = {
    subscribe: async function* (_parent, _arg, { dataSources }: RequestContext) {
        const [error, user] = await safeAsync(dataSources.user().authenticatedUser());
        if (error || !user) {
            throw new GraphQLError("Could not retrieve user details");
        }

        if (!user.callings.map(x => x.id).includes('calling:executive_secretary')) {
            throw new GraphQLError("The authenticated user does not have permission to subscribe to trivia games as the board");
        }

        const currentState = dataSources.triviaGame().getCurrentState();
        yield currentState;

        const asyncIterator = dataSources.pubsub.subscribe('TRIVIA_GAME_TOPIC');

        for await (const payload of asyncIterator) {
            yield payload;
        }
    },
    resolve: (payload: TriviaGameUpdateForAdmin) => payload
}