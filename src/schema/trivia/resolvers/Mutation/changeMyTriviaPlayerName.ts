import { randomUUID } from 'crypto';
import { RequestContext } from '../../../../context';
import type { MutationResolvers } from './../../../types.generated';
export const changeMyTriviaPlayerName: NonNullable<MutationResolvers['changeMyTriviaPlayerName']> = async (_parent, { newName }, { dataSources, user }: RequestContext) => {
    let triviaGameSessionId = user?.triviaGameSessionId;

    if (!triviaGameSessionId) {
        triviaGameSessionId = randomUUID();
        await dataSources.cookie().set({
            name: 'eb2ward-trivia-game',
            value: triviaGameSessionId,
            expires: null
        });
    }

    await dataSources.userTokenStore().setPlayerName(triviaGameSessionId, newName);

    try {
        dataSources.triviaGame().registerPlayer(triviaGameSessionId, newName);
    }
    catch (error) {
        return {
            success: false,
            error: {
                code: "GAME_NOT_FOUND",
                message: "Could not find an active trivia game"
            }
        }
    }

    return {
        success: true
    }
};