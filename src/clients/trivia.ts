import { RecordId } from "surrealdb";
import { createPubSub } from "graphql-yoga";
import { SurrealMachineClient } from "./surrealMachine";
import { TriviaAnswer, TriviaGameState, TriviaOption, TriviaQuestion } from "../schema/types.generated";

type TriviaQuestionDto = Omit<TriviaQuestion, 'correctAnswer'> & { correct_answer: TriviaAnswer };

export class TriviaClient {
    constructor(private surreal: SurrealMachineClient, private pubsub: ReturnType<typeof createPubSub>) { }

    private currentGame: TriviaGame | null = null;

    private currentGameSubscription = async ({ state, questionIndex }: { state: TriviaGameState, questionIndex?: number }) => {
        switch (state) {
            case 'QUESTION':
                await this.updateState();
                const question = this.currentGame?.getQuestionByIndex(questionIndex!);
                this.pubsub.publish('TRIVIA_GAME_TOPIC', {
                    state,
                    question: {
                        ...question,
                        correctAnswer: null
                    },
                    time: this.currentGame?.getQuestionTime()
                });
                break;
            case 'ANSWER':
                await this.updateScores();
                this.pubsub.publish('TRIVIA_GAME_TOPIC', {
                    state,
                    question: this.currentGame?.getQuestionByIndex(questionIndex!),
                    time: this.currentGame?.getAnswerTime()
                });
                break;
            case 'SCORE':
                await this.updateState();
                this.pubsub.publish('TRIVIA_GAME_TOPIC', {
                    state,
                    scores: this.currentGame?.getScores()
                });
                break;
            case 'PAUSED':
                await this.updateScores();
                this.pubsub.publish('TRIVIA_GAME_TOPIC', { state });
                break;
            case 'STOPPED':
                await this.updateState();
                this.pubsub.publish('TRIVIA_GAME_TOPIC', { state });
                this.currentGame?.unsubscribe('triviaClient');
                this.currentGame = null;
                break;
            case 'SPLASH':
                await this.updateState();
                this.pubsub.publish('TRIVIA_GAME_TOPIC', { state });
                break;
            case 'CLOSED':
                await this.updateState();
                this.pubsub.publish('TRIVIA_GAME_TOPIC', { state });
                this.currentGame?.unsubscribe('triviaClient');
                this.currentGame = null;
                break;
            default:
        };
    }

    /**
     * Ability to create a new game
     *  - Creates a game and stores in DB
     *  - Requires admin to enter a unique ID for the game
     *  - Triggered from admin view or game view if there is not a current game open
     */
    async createGame(gameId: string) {
        const [triviaQuestions] = await this.surreal.query<[TriviaQuestionDto[]]>({
            query: `SELECT * FROM trivia_question`
        });

        const formattedQuestions: TriviaQuestion[] = triviaQuestions.map(q => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correct_answer,
            category: q.category
        }));

        const newGame = new TriviaGame(gameId, formattedQuestions);

        const [response] = await this.surreal.query<[{ id: RecordId }]>({
            query: `CREATE trivia_game SET id = $gameId, state = $state, question_bank = $questionBank, scores = $scores, current_question_index = $currentQuestionIndex, players = $players`,
            params: newGame.serialize()
        });
        return !!response;
    }

    /**
     * Ability to start the current game
     *  - Loads the game by ID from the DB
     *  - Displays the game splash screen to provide players time to join
     *  - Starts from the current question if stopped during the question phase
     *  - Starts from the next question if stopped during the answer or score phases
     *  - Triggered from the admin view or the game view with right click
     */
    async startGame(gameId: string) {
        if (this.currentGame) await this.stopGame();

        const [response] = await this.surreal.query<[{ id: RecordId, state: TriviaGameState, questionBank: TriviaQuestion[], scores: string, currentQuestionIndex: number, players: string }]>({
            query: `
                SELECT
                    id,
                    state,
                    question_bank AS questionBank,
                    scores,
                    current_question_index AS currentQuestionIndex,
                    players
                FROM ONLY trivia_game
                WHERE id = $gameId
                LIMIT 1
            `,
            params: { gameId: new RecordId('trivia_game', gameId) }
        });

        if (!response) throw new Error("Game not found");

        this.currentGame = new TriviaGame(gameId).load(response);
        this.currentGame.subscribe('triviaClient', this.currentGameSubscription);
        this.currentGame.showSplashScreen();
    }

    private async updateScores() {
        if (!this.currentGame) return;

        await this.surreal.query({
            query: `UPDATE $id SET state = $state, scores = $scores, players = $players`,
            params: {
                id: this.currentGame.id,
                state: this.currentGame.getCurrentState(),
                scores: JSON.stringify(Array.from(this.currentGame.getRawScores())),
                players: JSON.stringify(Array.from(this.currentGame.getRegisteredPlayers()))
            }
        });
    }

    private async updateState() {
        if (!this.currentGame) return;

        try {
            await this.surreal.query({
                query: `UPDATE $id SET state = $state, current_question_index = $currentQuestionIndex`,
                params: {
                    id: this.currentGame.id,
                    state: this.currentGame.getCurrentState(),
                    currentQuestionIndex: this.currentGame.getCurrentQuestionIndex()
                }
            });
        }
        catch (error) {
            console.error(error);
        }
    }

    getCurrentState() {
        if (!this.currentGame) return null;
        
        const state = this.currentGame.getCurrentState();

        let question = null;
        let time = null;
        switch (state) {
            case 'QUESTION':
                question = {
                    ...this.currentGame.getQuestionByIndex(this.currentGame.getCurrentQuestionIndex()),
                    correctAnswer: null
                }
                time = this.currentGame.getQuestionTime();
                break;
            case 'ANSWER':
                question = this.currentGame.getQuestionByIndex(this.currentGame.getCurrentQuestionIndex());
                time = this.currentGame.getAnswerTime();
                break;
        };

        return {
            state,
            question,
            scores: state === 'SCORE' ? this.currentGame?.getScores() : null,
            time
        }
    }

    getCurrentGame() {
        return this.currentGame?.id.id.toString();
    }

    /**
     * Ability to move to the next question
     *  - Moves to the next question in the game
     *  - Skips the current question if in the question phase
     *  - Triggered from admin view or game view with right click
     */
    nextQuestion() {
        if (!this.currentGame) return null;
        this.currentGame.nextQuestion();
    }

    /**
     * Ability to pause the current game
     *  - Pauses the game on both the game and player views
     *  - Shows a splash screen with instructions on how to join
     *  - Triggered from admin view or game view with right click
     */
    pauseGame() {
        if (!this.currentGame) return null;
        this.currentGame.pause();
    }

    /**
     * Ability to resume the current game
     *  - Restarts timers for the current phase
     *  - Resumes the game on both the game and player views
     *  - Triggered from admin view or game view with right click
     */
    resumeGame() {
        if (!this.currentGame) return null;
        this.currentGame.resume();
    }

    /**
     * Ability to stop the current game (optional)
     *  - Kicks players out of the game
     *  - Triggered from admin view or game view with right click
     */
    stopGame() {
        if (!this.currentGame) return null;
        this.currentGame.stop();
    }

    /**
     * Ability to end the current game
     *  - Waits until the current question finishes
     *  - No more questions can be answered
     *  - Enables score pages
     *  - Triggered from admin view or game view with right click
     */
    showScoreAfterQuestion() {
        if (!this.currentGame) return null;
        this.currentGame.showScoreAfterQuestion();
    }

    /**
     * Ability to end the current game immediately
     *  - Invalidates current question if in the question phase
     *  - Triggered from admin view or game view with right click
     */
    showScoreImmediately() {
        if (!this.currentGame) return null;
        this.currentGame.showScoreImmediately();
    }

    closeGame() {
        if (!this.currentGame) return null;
        this.currentGame.closeGame();
    }

    registerAnswer(playerId: string, answer: TriviaAnswer) {
        if (!this.currentGame) return null;
        this.currentGame.registerAnswer(playerId, answer);
    }

    getPlayerScores(playerId: string) {
        if (!this.currentGame) return null;
        return this.currentGame.getScoresForPlayer(playerId) || null;
    }

    registerPlayer(playerId: string, playerName: string) {
        if (!this.currentGame) return null;
        this.currentGame.registerPlayer(playerId, playerName);
    }
}

export class TriviaGame {
    constructor(gameId: string, questions?: TriviaQuestion[]) {
        this.id = new RecordId('trivia_game', gameId);
        if (questions) {
            this.questionBank = this.randomizeQuestions(questions);
        }
    }

    id: RecordId;
    private readonly questionTime: number = 20000;
    private readonly answerTime: number = 5000;
    private readonly timeIncrement: number = 500;
    private remainingQuestionTime: number = 0;
    private remainingAnswerTime: number = 0;
    private subscribers: Map<string, Function> = new Map<string, Function>();
    private questionBank: TriviaQuestion[] = [];
    private scores: Map<string, Record<string, number>> = new Map<string, Record<string, number>>();
    private currentQuestionIndex: number = -1;
    private state: TriviaGameState = 'SPLASH';
    private stateBeforePause: TriviaGameState | null = null;
    private timeoutHandle: ReturnType<typeof setTimeout> | null = null;
    private isLastQuestion: boolean = false;
    private responses: Map<string, TriviaAnswer> = new Map<string, TriviaAnswer>();
    private registeredPlayers = new Map<string, string>();

    private randomizeQuestions = (allQuestions: TriviaQuestion[]): TriviaQuestion[] => {
        const questionsGroupedByCategory: Record<string, TriviaQuestion[]> = {};
        allQuestions.forEach(question => {
            if (!questionsGroupedByCategory[question.category]) {
                questionsGroupedByCategory[question.category] = [];
            }
            questionsGroupedByCategory[question.category].push(question);
        });
        const uniqueCategories = Object.keys(questionsGroupedByCategory);
        const randomizedQuestions: TriviaQuestion[] = [];
        let categoryIndex = 0;
        while (randomizedQuestions.length < allQuestions.length) {
            const category = uniqueCategories[categoryIndex];
            const questionsInCategory = questionsGroupedByCategory[category];
            const randomlySkipCategory = Math.random() < 0.3;
            if (!randomlySkipCategory && questionsInCategory.length > 0) {
                const randomQuestionIndex = Math.floor(Math.random() * questionsInCategory.length);
                const [selectedQuestion] = questionsInCategory.splice(randomQuestionIndex, 1);
                randomizedQuestions.push(this.randomizeAnswers(selectedQuestion));
            }
            categoryIndex = (categoryIndex + 1) % uniqueCategories.length;
        }
        return randomizedQuestions;
    }

    private randomizeAnswers = (question: TriviaQuestion): TriviaQuestion => {
        const optionLookup: Record<number, TriviaAnswer> = {
            0: "A",
            1: "B",
            2: "C",
            3: "D"
        };
        const markedOptions = question.options.map(option => ({
            ...option,
            isCorrectAnswer: question.correctAnswer === option.option
        }));

        markedOptions.sort(() => Math.random() - 0.5);

        const [answer, newOptions] = markedOptions.reduce((result, option, index) => {
            if (index > 3) return result;
            option.option = optionLookup[index];
            if (option.isCorrectAnswer) {
                result[0] = optionLookup[index];
            }
            result[1].push({
                option: option.option,
                text: option.text
            });
            return result;
        }, ["A", []] as [TriviaAnswer, TriviaOption[]]);

        question.correctAnswer = answer;
        question.options = newOptions;
        return question;
    }

    serialize = () => {
        return {
            gameId: this.id,
            state: this.state,
            questionBank: this.questionBank,
            scores: JSON.stringify(Array.from(this.scores)),
            currentQuestionIndex: this.currentQuestionIndex,
            players: JSON.stringify(Array.from(this.registeredPlayers))
        }
    }

    load = (input: { state: TriviaGameState, questionBank: TriviaQuestion[], scores: string, currentQuestionIndex: number, players: string }) => {
        this.state = input.state;
        this.questionBank = input.questionBank;
        this.scores = new Map(JSON.parse(input.scores));
        this.currentQuestionIndex = input.currentQuestionIndex;
        this.registeredPlayers = new Map(JSON.parse(input.players));
        return this;
    }

    subscribe = (key: string, callback: Function) => {
        this.subscribers.set(key, callback);
    }

    unsubscribe = (key: string) => {
        this.subscribers.delete(key);
    }

    notifySubscribers = (data: { state: TriviaGameState, questionIndex?: number }) => {
        this.subscribers.forEach(callback => callback(data));
    }

    getQuestionTime = () => {
        return this.remainingQuestionTime;
    }

    getAnswerTime = () => {
        return this.remainingAnswerTime;
    }

    getCurrentState = () => {
        return this.state;
    }

    getCurrentQuestionIndex = () => {
        return this.currentQuestionIndex;
    }

    getQuestionByIndex = (index: number) => {
        return this.questionBank[index];
    }

    showSplashScreen = () => {
        this.state = 'SPLASH';
        this.responses.clear();
        this.notifySubscribers({ state: this.state });
    }

    nextQuestion = (skipIncrement: boolean = false) => {
        this.remainingAnswerTime -= this.timeIncrement;
        if (this.remainingAnswerTime > 0) {
            this.timeoutHandle = setTimeout(this.nextQuestion, this.timeIncrement);
            return;
        }

        if (!skipIncrement && this.currentQuestionIndex < this.questionBank.length) {
            this.currentQuestionIndex += 1;
        }

        if (this.currentQuestionIndex >= this.questionBank.length) {
            this.showScoreImmediately();
            return;
        }

        if (this.currentQuestionIndex === this.questionBank.length - 1) {
            this.isLastQuestion = true;
        }

        this.state = 'QUESTION';
        this.remainingQuestionTime = this.questionTime;
        this.timeoutHandle = setTimeout(this.showAnswer, this.timeIncrement);

        this.notifySubscribers({
            state: this.state,
            questionIndex: this.currentQuestionIndex
        });
    }

    showAnswer = () => {
        this.remainingQuestionTime -= this.timeIncrement;
        if (this.remainingQuestionTime > 0) {
            this.timeoutHandle = setTimeout(this.showAnswer, this.timeIncrement);
            return;
        }

        this.state = 'ANSWER';
        this.remainingAnswerTime = this.answerTime;
        this.scoreQuestion();

        if (this.isLastQuestion) {
            this.timeoutHandle = setTimeout(this.showScoreImmediately, this.timeIncrement);
        }
        else {
            this.timeoutHandle = setTimeout(this.nextQuestion, this.timeIncrement);
        }

        this.notifySubscribers({
            state: this.state,
            questionIndex: this.currentQuestionIndex
        });
    }

    pause = () => {
        if (!(['QUESTION', 'ANSWER'] as TriviaGameState[]).includes(this.state)) return;

        if (this.timeoutHandle) {
            clearTimeout(this.timeoutHandle);
            this.timeoutHandle = null;
        }

        this.stateBeforePause = this.state;
        this.state = 'PAUSED';

        this.notifySubscribers({ state: this.state });
    }

    resume = () => {
        const previousState = this.stateBeforePause;
        this.stateBeforePause = null;

        switch (previousState) {
            case 'QUESTION':
                this.nextQuestion(true);
                break;
            case 'ANSWER':
                this.showAnswer();
                break;
            default:
        }
    }

    stop = () => {
        this.state = 'STOPPED';
        this.responses.clear();
        this.notifySubscribers({ state: this.state });
    }

    showScoreAfterQuestion = () => {
        this.isLastQuestion = true;
    }

    showScoreImmediately = () => {
        this.remainingAnswerTime -= this.timeIncrement;
        if (this.remainingAnswerTime > 0) {
            this.timeoutHandle = setTimeout(this.showScoreImmediately, this.timeIncrement);
            return;
        }

        if (this.currentQuestionIndex < this.questionBank.length - 1) {
            this.stateBeforePause = this.state;
        }

        this.state = 'SCORE';
        this.isLastQuestion = false;
        this.notifySubscribers({ state: this.state });
    }

    closeGame = () => {
        this.state = 'CLOSED';
        this.responses.clear();
        this.notifySubscribers({ state: this.state });
    }

    registerAnswer = (playerId: string, answer: TriviaAnswer) => {
        this.responses.set(playerId, answer);
    }

    scoreQuestion = () => {
        this.responses.forEach((answer, playerId) => {
            const currentQuestion = this.questionBank[this.currentQuestionIndex];
            if (currentQuestion.correctAnswer === answer) {
                const playerScores = this.scores.get(playerId) || {};
                playerScores[this.questionBank[this.currentQuestionIndex].category] = (playerScores[this.questionBank[this.currentQuestionIndex].category] || 0) + 1;
                this.scores.set(playerId, playerScores);
            }
        });
        this.responses.clear();
        this.registeredPlayers.forEach((_, playerId) => {
            if (!this.scores.has(playerId)) {
                this.scores.set(playerId, {});
            }
        });
    }
    
    getRawScores = () => {
        return this.scores;
    }

    getScores = () => {
        // replace player IDs with names and format by category
        const scoresPerCategory = new Map<string, { playerName: string, score: number }[]>();
        this.scores.forEach((score, playerId) => {
            const playerName = this.registeredPlayers.get(playerId) || playerId;
            Object.entries(score).forEach(([categoryName, score]) => {
                const category = scoresPerCategory.get(categoryName) || [];
                category.push({ playerName, score });
                scoresPerCategory.set(categoryName, category);
            });
        });

        return Array.from(scoresPerCategory.entries().map(([category, scores]) => ({
            category,
            scores: scores.sort((a, b) => b.score - a.score)
        })));
    }

    getScoresForPlayer = (playerId: string) => {
        return Object.entries(this.scores.get(playerId) || {}).map(([category, score]) => ({
            category,
            score
        }));
    }

    registerPlayer = (playerId: string, playerName: string) => {
        this.registeredPlayers.set(playerId, playerName);
    }

    getRegisteredPlayers = () => {
        return this.registeredPlayers;
    }
}