import { TriviaClient } from "../clients/trivia";
import { TriviaAnswer } from "../schema/types.generated";
import { safeAsync } from "../utilities/safeAsync";

export class TriviaGameDataSource {
    constructor(private triviaClient: TriviaClient) { }

    createGame = async (gameId: string) => {
        const [error, success] = await safeAsync(this.triviaClient.createGame(gameId));
        return (error || !success) ? false : true;
    }

    startGame = async (gameId: string) => {
        const [error, success] = await safeAsync(this.triviaClient.startGame(gameId));
        return error ? false : true;
    }

    getCurrentGame = () => {
        return this.triviaClient.getCurrentGame();
    }

    nextQuestion = () => {
        this.triviaClient.nextQuestion();
    }

    getCurrentState = () => {
        return this.triviaClient.getCurrentState();
    }

    pauseGame = () => {
        this.triviaClient.pauseGame();
    }

    resumeGame = () => {
        this.triviaClient.resumeGame();
    }

    stopGame = () => {
        this.triviaClient.stopGame();
    }

    showScoreAfterQuestion = () => {
        this.triviaClient.showScoreAfterQuestion();
    }

    showScoreImmediately = () => {
        this.triviaClient.showScoreImmediately();
    }

    closeGame = () => {
        this.triviaClient.closeGame();
    }

    registerPlayer = (playerId: string, playerName: string) => {
        this.triviaClient.registerPlayer(playerId, playerName);
    }

    registerAnswer = (playerId: string, answer: TriviaAnswer) => {
        this.triviaClient.registerAnswer(playerId, answer);
    }

    getPlayerScores = (playerId: string) => {
        const scores = this.triviaClient.getPlayerScores(playerId);
        if (!scores) return null;
        const totalScore = scores.reduce((total, score) => {
            total += score.score;
            return total;
        }, 0);
        return [...scores, { category: "Total Score", score: totalScore }];
    }
}