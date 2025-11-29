import { RequestContext } from '../../../../context';
import type { QueryResolvers } from './../../../types.generated';
export const currentGame: NonNullable<QueryResolvers['currentGame']> = async (_parent, _arg, { dataSources }: RequestContext) => {
    const gameId = dataSources.triviaGame().getCurrentGame();
    if (!gameId) return null;

    return {
        id: gameId
    }
};