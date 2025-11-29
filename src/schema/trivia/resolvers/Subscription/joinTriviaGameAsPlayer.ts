import { RequestContext } from '../../../../context';
import type { SubscriptionResolvers, TriviaGameUpdateForPlayer } from './../../../types.generated';
import { GraphQLError } from 'graphql';

export const joinTriviaGameAsPlayer: NonNullable<SubscriptionResolvers['joinTriviaGameAsPlayer']> = {
    subscribe: async function* (_parent, _args, { dataSources, user }: RequestContext) {
        let triviaGameSessionId = user?.triviaGameSessionId;
    
        if (!triviaGameSessionId) {
            throw new GraphQLError("Not authenticated for game");
        }

        const playerName = await dataSources.userTokenStore().getPlayerName(triviaGameSessionId);
        if (!playerName) {
            throw new GraphQLError("Not authenticated for game");
        }
    
        try {
            dataSources.triviaGame().registerPlayer(triviaGameSessionId, playerName);
        }
        catch (error) {
            throw new GraphQLError("Could not find an active trivia game");
        }

        const currentState = dataSources.triviaGame().getCurrentState();
        yield currentState;

        const asyncIterator = dataSources.pubsub.subscribe('TRIVIA_GAME_TOPIC');

        for await (const payload of asyncIterator) {
            yield payload;
        }
    },
    resolve: (payload: TriviaGameUpdateForPlayer) => payload
}