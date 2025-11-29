import { RequestContext } from '../../../../context';
import type { MutationResolvers } from './../../../types.generated';
export const submitTriviaAnswer: NonNullable<MutationResolvers['submitTriviaAnswer']> = async (_parent, { answer }, { dataSources, user }: RequestContext) => {
    const triviaGameSessionId = user?.triviaGameSessionId;

    if (!triviaGameSessionId) {
        return {
            success: false,
            error: {
                code: "INSUFFICIENT_PERMISSIONS",
                message: "Could not identify trivia player. Please join the game before submitting answers."
            }
        }
    }
    
    try {
        dataSources.triviaGame().registerAnswer(triviaGameSessionId, answer);
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