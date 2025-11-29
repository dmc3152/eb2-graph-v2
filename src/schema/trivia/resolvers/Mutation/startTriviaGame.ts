import { RequestContext } from '../../../../context';
import { safeAsync } from '../../../../utilities/safeAsync';
import type { MutationResolvers } from './../../../types.generated';
export const startTriviaGame: NonNullable<MutationResolvers['startTriviaGame']> = async (_parent, { gameId }, { dataSources }: RequestContext) => {
    const [error, user] = await safeAsync(dataSources.user().authenticatedUser());
    if (error || !user) return {
        success: false,
        error: {
            code: "INSUFFICIENT_PERMISSIONS",
            message: error?.message || "Could not retrieve user details"
        }
    }

    if (!user.callings.map(x => x.id).includes('calling:executive_secretary')) {
        return {
            success: false,
            error: {
                code: "INSUFFICIENT_PERMISSIONS",
                message: "The authenticated user does not have permission to start trivia games"
            }
        }
    }

    const success = await dataSources.triviaGame().startGame(gameId);
    if (!success) {
        return {
            success: false,
            error: {
                code: "GAME_NOT_FOUND",
                message: "Could not find the game to start"
            }
        }
    }

    return {
        success: true
    };
};