// lib/game/utils.ts (Updated)

import { StorageManager } from './storage';
import { QUESTION_GROUPS, QuestionGroup, Question } from './questionGroups';
import { ValidationEngine, ValidationContext } from './validation';
import { 
  AFRICAN_SNACKS, 
  AFRICAN_LANGUAGES, 
  AFRICAN_ARTISTS, 
  COUNTRY_BORDERS, 
  AFRICAN_CITIES,
  COUNTRY_CITIES 
} from './data';



export interface GameState {
    sessionId: string;
    email?: string;
    isAuthenticated: boolean;
    currentGroupId: string;
    currentQuestion: number;
    answers: string[];
    correctAnswers: number;
    wrongAnswers: number;
    status: 'in_progress' | 'completed' | 'failed';
    startTimestamp: number;
    scrambledWord?: string;
    completedGroups: string[];
}

export interface FeedbackState {
    show: boolean;
    isCorrect: boolean;
    message: string;
}

export interface SessionInfo {
    isExistingSession: boolean;
    sessionId: string;
    gameState: GameState;
}

/**
 * Generates a unique session ID for the game
 */
export const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Creates initial game state
 */
export const createInitialGameState = (email?: string, groupId?: string): GameState => ({
    sessionId: generateSessionId(),
    email,
    isAuthenticated: !!email,
    currentGroupId: groupId || QUESTION_GROUPS[0]?.groupId || '',

    currentQuestion: 0,
    answers: [],
    correctAnswers: 0,
    wrongAnswers: 0,
    status: 'in_progress',
    startTimestamp: Date.now(),
    completedGroups: []
});

/**
 * Loads saved game state or creates new one - now email-aware
 */
export const loadOrCreateGameState = async (
    sessionId?: string, 
    email?: string, 
    groupId?: string
): Promise<SessionInfo> => {
    const storage = StorageManager.getInstance();
    
    // If email is provided, check for existing active session first
    if (email) {
        const activeSessionId = await storage.getActiveSessionByEmail(email);
        if (activeSessionId) {
            const existingState = await storage.loadGame(activeSessionId);
            if (existingState && existingState.status === 'in_progress') {
                return {
                    isExistingSession: true,
                    sessionId: activeSessionId,
                    gameState: existingState
                };
            }
        }
    }
    
    // If specific sessionId provided, try to load it
    if (sessionId) {
        const savedState = await storage.loadGame(sessionId);
        if (savedState) {
            // If email is provided and matches, mark as active
            if (email && savedState.email === email) {
                await storage.markSessionAsActive(email, sessionId);
            }
            return {
                isExistingSession: true,
                sessionId: sessionId,
                gameState: savedState
            };
        }
    }
    
    // Create new game state
    const newGameState = createInitialGameState(email, groupId);
    
    // If email is provided, mark this new session as active
    if (email) {
        await storage.markSessionAsActive(email, newGameState.sessionId);
    }
    
    return {
        isExistingSession: false,
        sessionId: newGameState.sessionId,
        gameState: newGameState
    };
};

/**
 * Saves game state and manages active session
 */
export const saveGameState = async (gameState: GameState): Promise<void> => {
    const storage = StorageManager.getInstance();
    await storage.saveGame(gameState.sessionId, gameState);
    
    // If user has email and game is still in progress, ensure it's marked as active
    if (gameState.email && gameState.status === 'in_progress') {
        await storage.markSessionAsActive(gameState.email, gameState.sessionId);
    }
    // If game is completed or failed, clear active session
    else if (gameState.email && (gameState.status === 'completed' || gameState.status === 'failed')) {
        const activeSession = await storage.getActiveSessionByEmail(gameState.email);
        if (activeSession === gameState.sessionId) {
            await storage.clearUserActiveSessions(gameState.email);
        }
    }
};

/**
 * Starts a new game session for a user (clears active session)
 */
export const startNewGameSession = async (email?: string, groupId?: string): Promise<SessionInfo> => {
    const storage = StorageManager.getInstance();
    
    // If email provided, clear any existing active session
    if (email) {
        await storage.clearUserActiveSessions(email);
    }
    
    // Create new game state
    const newGameState = createInitialGameState(email, groupId);
    
    // Mark as active if email provided
    if (email) {
        await storage.markSessionAsActive(email, newGameState.sessionId);
    }
    
    // Save the new game state
    await storage.saveGame(newGameState.sessionId, newGameState);
    
    return {
        isExistingSession: false,
        sessionId: newGameState.sessionId,
        gameState: newGameState
    };
};

/**
 * Gets all sessions for a user
 */
export const getUserGameSessions = async (email: string): Promise<GameState[]> => {
    const storage = StorageManager.getInstance();
    const sessionIds = await storage.getUserSessions(email);
    
    const sessions: GameState[] = [];
    for (const sessionId of sessionIds) {
        const gameState = await storage.loadGame(sessionId);
        if (gameState && gameState.email === email) {
            sessions.push(gameState);
        }
    }
    
    // Sort by most recent first
    return sessions.sort((a, b) => b.startTimestamp - a.startTimestamp);
};

/**
 * Gets the active session for a user
 */
export const getActiveUserSession = async (email: string): Promise<GameState | null> => {
    const storage = StorageManager.getInstance();
    const activeSessionId = await storage.getActiveSessionByEmail(email);
    
    if (!activeSessionId) return null;
    
    const gameState = await storage.loadGame(activeSessionId);
    return (gameState && gameState.email === email) ? gameState : null;
};

/**
 * Resumes a specific session for a user
 */
export const resumeUserSession = async (email: string, sessionId: string): Promise<SessionInfo | null> => {
    const storage = StorageManager.getInstance();
    const gameState = await storage.loadGame(sessionId);
    
    if (!gameState || gameState.email !== email) {
        return null;
    }
    
    // Mark as active if it's still in progress
    if (gameState.status === 'in_progress') {
        await storage.markSessionAsActive(email, sessionId);
    }
    
    return {
        isExistingSession: true,
        sessionId: sessionId,
        gameState: gameState
    };
};

/**
 * Gets current question group
 */
export const getCurrentQuestionGroup = (groupId: string): QuestionGroup | null => {
    return QUESTION_GROUPS.find(group => group.groupId === groupId) || null;
};

/**
 * Gets all available question groups
 */
export const getAllQuestionGroups = (): QuestionGroup[] => {
    return QUESTION_GROUPS;
};

/**
 * Generates scrambled word for word scramble questions
 */
export const generateScrambledWord = () => {        
    const randomCity = AFRICAN_CITIES[Math.floor(Math.random() * AFRICAN_CITIES.length)] || '';
    return {randomCity, scrambledCity: randomCity.split('').sort(() => Math.random() - 0.5).join('').toUpperCase()};
};

/**
 * Calculates feedback message based on game state
 */
export const getFeedbackMessage = (
    isCorrect: boolean, 
    correctAnswers: number, 
    wrongAnswers: number, 
    totalQuestions: number,
    maxWrong: number
): string => {
    if (isCorrect) {
        return correctAnswers === totalQuestions ? 
            'Congratulations! You\'ve completed all questions!' : 
            'Correct! Great job!';
    } else {
        return wrongAnswers >= maxWrong ? 
            `Game Over! You\'ve made ${maxWrong} incorrect answers.` : 
            `Incorrect! Try again. ${maxWrong - wrongAnswers} mistakes remaining.`;
    }
};

/**
 * Determines if game should end based on current state
 */
export const shouldEndGame = (
    correctAnswers: number, 
    wrongAnswers: number, 
    totalQuestions: number,
    maxWrong: number
): {
    shouldEnd: boolean;
    status: 'completed' | 'failed' | 'in_progress';
} => {
    if (correctAnswers === totalQuestions) {
        return { shouldEnd: true, status: 'completed' };
    }
    if (wrongAnswers >= maxWrong) {
        return { shouldEnd: true, status: 'failed' };
    }
    return { shouldEnd: false, status: 'in_progress' };
};

/**
 * Calculates progress percentage
 */
export const calculateProgress = (currentQuestion: number, totalQuestions: number): number => {
    return (currentQuestion / totalQuestions) * 100;
};

/**
 * Clears saved game state
 */
export const clearGameState = async (sessionId: string): Promise<void> => {
    const storage = StorageManager.getInstance();
    await storage.clearGame(sessionId);
};

/**
 * Gets all saved sessions
 */
export const getAllSavedSessions = async (): Promise<string[]> => {
    const storage = StorageManager.getInstance();
    return await storage.getAllSessions();
};

/**
 * Clears all sessions for a user
 */
export const clearUserSessions = async (email: string): Promise<void> => {
    const storage = StorageManager.getInstance();
    const userSessions = await storage.getUserSessions(email);
    
    // Clear each session
    for (const sessionId of userSessions) {
        await storage.clearGame(sessionId);
    }
    
    // Clear active session mapping
    await storage.clearUserActiveSessions(email);
};


/**
 * Enhanced generateDynamicQuestionContent with better context
 */
export const generateDynamicQuestionContent = (question: Question, previousAnswers: string[]): Question => {
  if (!question.isDynamic) return question;

  const updatedQuestion = { ...question };

  switch (question.id) {
    case 3: // Snack question
      const randomSnack = AFRICAN_SNACKS[Math.floor(Math.random() * AFRICAN_SNACKS.length)];
      updatedQuestion.title = `Which African country is "${randomSnack?.name}" a traditional snack from?`;
      updatedQuestion.description = `"${randomSnack?.name}" is a popular traditional snack. Can you identify its country of origin?`;
      updatedQuestion.dynamicData = { correctCountry: randomSnack?.country };
      break;

    case 5: // Language question
      const randomLanguage = AFRICAN_LANGUAGES[Math.floor(Math.random() * AFRICAN_LANGUAGES.length)];
      updatedQuestion.title = `In which African country is "${randomLanguage?.name}" primarily spoken?`;
      updatedQuestion.description = `"${randomLanguage?.name}" is one of the languages spoken in Africa. Which country is it primarily associated with?`;
      updatedQuestion.dynamicData = { correctCountry: randomLanguage?.country };
      break;

    case 6: // Artist question
      const randomArtist = AFRICAN_ARTISTS[Math.floor(Math.random() * AFRICAN_ARTISTS.length)];
      updatedQuestion.title = `Which African country is the artist "${randomArtist?.name}" from?`;
      updatedQuestion.description = `"${randomArtist?.name}" is a well-known African artist. Can you identify their country of origin?`;
      updatedQuestion.dynamicData = { correctCountry: randomArtist?.country };
      break;

    case 8: // Scrambled city question
          const {randomCity ,scrambledCity } = generateScrambledWord()
          updatedQuestion.title = `Unscramble this city name: ${scrambledCity}`;
          updatedQuestion.description = ` Unscramble the letters to find the city name.`;
          updatedQuestion.dynamicData = { originalCity: randomCity  };
      
      break;
  }

  return updatedQuestion;
};

/**
 * Enhanced context helper for non-dynamic questions that reference previous answers
 */

export const addContextualReferences = (question: Question, previousAnswers: string[], questionId: number): Question => {
  const enhancedQuestion = { ...question };
  
  switch (questionId) {
    case 2: // Most populous city - depends on Q1
      if (previousAnswers[0]) {
        enhancedQuestion.title = `What is the most populous city in ${previousAnswers[0]?.toUpperCase()}?`;
        enhancedQuestion.description = `You selected "${previousAnswers[0]?.toUpperCase()}" in Question 1. Now name its most populous city.`;
      }
      break;
      
    case 4: // Neighboring country - depends on Q1
      if (previousAnswers[0]) {
        enhancedQuestion.title = `Name a country that borders ${previousAnswers[0]?.toUpperCase()}.`;
        enhancedQuestion.description = `Based on "${previousAnswers[0]?.toUpperCase()}" from Question 1, name one of its neighboring countries.`;
      }
      break;
      
    case 7: // Currency - depends on Q4
      if (previousAnswers[3]) {
        enhancedQuestion.title = `What is the official currency of ${previousAnswers[3]}?`;
        enhancedQuestion.description = `You answered "${previousAnswers[3]}" in Question 4. What currency do they use?`;
      }
      break;
      
    case 8: // Scrambled city - already handled in dynamic content, but add more context
      if (previousAnswers[3] && !question.isDynamic) {
        enhancedQuestion.description = `Unscramble this city name from ${previousAnswers[3]} (your answer to Question 4)`;
      }
      break;
      
    case 9: // 2nd most populous site - depends on Q1 for region
      if (previousAnswers[0]) {
        enhancedQuestion.description = `Using the NECWS acronym for African regions (North, East, Central, West, South),  
start at the region of your Q1 country's location, which is "${previousAnswers[0]}" (e.g., Kenya is East (E)).  

From that starting region, move 8 steps forward around the acronym in a circular manner.  

Then, identify the **second most populous city** in the region you land on after moving 8 steps.`;

              }
      break;
      
            }
  
  return enhancedQuestion;
};

/**
 * Enhanced answer validation with dynamic data support
 */
export const validateAnswer = async (
    answer: string, 
    questionId: number, 
    previousAnswers: string[],
    groupId: string,
    scrambledWord?: string,
    dynamicData?: any
): Promise<boolean> => {
    const group = getCurrentQuestionGroup(groupId);
    if (!group) return false;

    const question = group.questions[questionId - 1];
    if (!question || !question.validationFunction) return false;

    const context: ValidationContext = {
        answer,
        questionId,
        previousAnswers,
        groupId,
        scrambledWord,
        dynamicData
    };

    const validator = ValidationEngine.getInstance();
    return await validator.validate(context, question.validationFunction);
};
