import { RequestContext } from '../../../../context';
import { safeAsync } from '../../../../utilities/safeAsync';
import type { MutationResolvers } from './../../../types.generated';
export const pauseTriviaGame: NonNullable<MutationResolvers['pauseTriviaGame']> = async (_parent, _arg, { dataSources }: RequestContext) => {
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
                message: "The authenticated user does not have permission to pause trivia games"
            }
        }
    }

    try {
        dataSources.triviaGame().pauseGame();
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