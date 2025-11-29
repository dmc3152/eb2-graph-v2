import { RequestContext } from '../../../../context';
import type { QueryResolvers } from './../../../types.generated';
export const myTriviaScore: NonNullable<QueryResolvers['myTriviaScore']> = async (_parent, _arg, { dataSources, user }: RequestContext) => {
    const triviaGameSessionId = user?.triviaGameSessionId;
    if (!triviaGameSessionId) return [];
    
    return dataSources.triviaGame().getPlayerScores(triviaGameSessionId) || [];
};