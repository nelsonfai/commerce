'use client';

import { useState, useEffect } from 'react';
import {
  GameState,
  FeedbackState,
  loadOrCreateGameState,
  saveGameState,
  validateAnswer,
  generateScrambledWord,
  getFeedbackMessage,
  shouldEndGame,
  calculateProgress,
  getCurrentQuestionGroup,
  getAllQuestionGroups,
  clearGameState,
  startNewGameSession,
  SessionInfo,
  generateDynamicQuestionContent,
  addContextualReferences
} from 'lib/game/utils';

import { 
  Question,
  QUESTION_GROUPS
} from 'lib/game/questionGroups';

import { 
  EmailPrompt, 
  GameCompleted, 
  GameOver, 
  ProgressHeader, 
  FeedbackDisplay, 
  ErrorDisplay,
  GroupSelector 
} from 'components/game/gamecomponents';

interface QuizGameProps {
  initialGroupId?: string;
  sessionId?: string;
}

const QuizGame: React.FC<QuizGameProps> = ({ initialGroupId, sessionId }: QuizGameProps) =>{
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailPrompt, setShowEmailPrompt] = useState(true);
  const [showGroupSelector, setShowGroupSelector] = useState(false);
  const [email, setEmail] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);
  const [currentQuestionData, setCurrentQuestionData] = useState<Question | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({
    show: false,
    isCorrect: false,
    message: ''
  });

  // Initialize game state on component mount
  useEffect(() => {
    const initializeGame = async () => {
      try {
        setIsLoading(true);
        const sessionResult = await loadOrCreateGameState(sessionId, undefined, initialGroupId);
        setSessionInfo(sessionResult);
        setGameState(sessionResult.gameState);
        
        // Show email prompt only for new games without email
        if (sessionResult.gameState.email) {
          setShowEmailPrompt(false);
          setEmail(sessionResult.gameState.email);
        } else if (sessionResult.isExistingSession) {
          // If it's an existing session but no email, still show email prompt
          setShowEmailPrompt(true);
        }
      } catch (error) {
        console.error('Failed to initialize game:', error);
        setError('Failed to load game. Please refresh and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeGame();
  }, [sessionId, initialGroupId]);

  // Save game state whenever it changes
  useEffect(() => {
    if (gameState && !isLoading) {
      saveGameState(gameState).catch(error => {
        console.error('Failed to save game state:', error);
      });
    }
  }, [gameState, isLoading]);

  // Generate dynamic question content and scrambled word
  useEffect(() => {
    if (gameState) {
      const currentGroup = getCurrentQuestionGroup(gameState.currentGroupId);
      if (currentGroup) {
        const baseQuestion = currentGroup.questions[gameState.currentQuestion];
        if (baseQuestion) {
          // Generate dynamic content for the current question
          const dynamicQuestion = generateDynamicQuestionContent(baseQuestion, gameState.answers);
          
          // Add contextual information for questions that reference previous answers
          const enhancedQuestion = addContextualInfo(dynamicQuestion, gameState.answers, currentGroup.questions);
          setCurrentQuestionData(enhancedQuestion);

        }
      }
    }
  }, [gameState?.currentQuestion, gameState?.answers, gameState?.currentGroupId]);

  // Helper function to add contextual information to questions
  const addContextualInfo = (question: Question, previousAnswers: string[], allQuestions: Question[]): Question => {
    if (!question) return question;

    // First apply dynamic content if needed
    let processedQuestion = question.isDynamic ? 
      generateDynamicQuestionContent(question, previousAnswers) : 
      { ...question };

    // Then add contextual references for questions that depend on previous answers
    processedQuestion = addContextualReferences(processedQuestion, previousAnswers, question.id);

    return processedQuestion;
  };

  const handleEmailSubmit = async () => {
    if (!gameState) return;
    
    const updatedState = { 
      ...gameState, 
      email: email.trim(),
      isAuthenticated: true 
    };
    setGameState(updatedState);
    setShowEmailPrompt(false);

    // Save the updated state with email
    try {
      await saveGameState(updatedState);
    } catch (error) {
      console.error('Failed to save game state with email:', error);
    }
  };

  const handleGroupSelect = async (groupId: string) => {
    if (!gameState) return;
    
    try {
      // Start a new game session with the selected group
      const sessionResult = await startNewGameSession(gameState.email, groupId);
      setSessionInfo(sessionResult);
      setGameState(sessionResult.gameState);
      setShowGroupSelector(false);
      setCurrentAnswer('');
      setError(null);
      setFeedback({ show: false, isCorrect: false, message: '' });
      setScrambledWord('');
      setCurrentQuestionData(null);
    } catch (error) {
      console.error('Failed to start new game session:', error);
      setError('Failed to start new game. Please try again.');
    }
  };

  const handleSubmitAnswer = async () => {
    if (!gameState || !currentAnswer.trim() || !currentQuestionData) {
      setError('Please enter an answer');
      return;
    }

    const currentGroup = getCurrentQuestionGroup(gameState.currentGroupId);
    if (!currentGroup) {
      setError('Invalid question group');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const isCorrect = await validateAnswer(
        currentAnswer, 
        gameState.currentQuestion + 1, 
        gameState.answers,
        gameState.currentGroupId,
        gameState.scrambledWord,
        currentQuestionData.dynamicData // Pass dynamic data to validation
      );
      
      const newAnswers = [...gameState.answers, currentAnswer];
      const newCorrect = isCorrect ? gameState.correctAnswers + 1 : gameState.correctAnswers;
      const newWrong = isCorrect ? gameState.wrongAnswers : gameState.wrongAnswers + 1;

      const feedbackMessage = getFeedbackMessage(
        isCorrect, 
        newCorrect, 
        newWrong, 
        currentGroup.questions.length,
        currentGroup.maxWrong
      );
      
      // Show feedback
      setFeedback({
        show: true,
        isCorrect,
        message: feedbackMessage
      });

      const { shouldEnd, status } = shouldEndGame(
        newCorrect, 
        newWrong, 
        currentGroup.questions.length,
        currentGroup.maxWrong
      );

      if (shouldEnd) {
        // Game ends after delay
        setTimeout(() => {
          const completedGroups = status === 'completed' 
            ? [...gameState.completedGroups, gameState.currentGroupId]
            : gameState.completedGroups;
            
          setGameState(prev => prev ? {
            ...prev,
            answers: newAnswers,
            correctAnswers: newCorrect,
            wrongAnswers: newWrong,
            status,
            completedGroups
          } : prev);
        }, 2000);
      } else if (isCorrect) {
        // Move to next question after delay
        setTimeout(() => {
          setGameState(prev => prev ? {
            ...prev,
            answers: newAnswers,
            correctAnswers: newCorrect,
            currentQuestion: prev.currentQuestion + 1
          } : prev);
          setCurrentAnswer('');
          setFeedback({ show: false, isCorrect: false, message: '' });
        }, 2000);
      } else {
        // Update wrong answers but stay on same question
        setGameState(prev => prev ? {
          ...prev,
          wrongAnswers: newWrong
        } : prev);
        setTimeout(() => {
          setFeedback({ show: false, isCorrect: false, message: '' });
        }, 2000);
      }
    } catch (err) {
      console.error('Error validating answer:', err);
      setError('Failed to validate answer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = async () => {
    if (!gameState) return;
    
    try {
      // Start a new game session (this will clear the old one)
      const sessionResult = await startNewGameSession(gameState.email, gameState.currentGroupId);
      setSessionInfo(sessionResult);
      setGameState(sessionResult.gameState);
      setCurrentAnswer('');
      setError(null);
      setFeedback({ show: false, isCorrect: false, message: '' });
      setScrambledWord('');
      setCurrentQuestionData(null);
    } catch (error) {
      console.error('Failed to restart game:', error);
      setError('Failed to restart game. Please refresh and try again.');
    }
  };

  const handleNewGroup = () => {
    setShowGroupSelector(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600">Loading game...</p>
        </div>
      </div>
    );
  }

  if (!gameState) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Failed to load game. Please refresh and try again.</p>
        </div>
      </div>
    );
  }

  // Group selector screen
  if (showGroupSelector) {
    return (
      <GroupSelector
        availableGroups={getAllQuestionGroups()}
        completedGroups={gameState.completedGroups}
        onSelectGroup={handleGroupSelect}
        onBack={() => setShowGroupSelector(false)}
      />
    );
  }

  // Email prompt screen
  if (showEmailPrompt) {
    const currentGroup = getCurrentQuestionGroup(gameState.currentGroupId);
    return (
      <EmailPrompt
        email={email}
        setEmail={setEmail}
        onSubmit={handleEmailSubmit}
        totalQuestions={currentGroup?.questions.length || 0}
        groupTitle={currentGroup?.title || 'Quiz Game'}
        groupDescription={currentGroup?.description || ''}
      />
    );
  }

  const currentGroup = getCurrentQuestionGroup(gameState.currentGroupId);
  if (!currentGroup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Question group not found. Please select a valid group.</p>
          <button
            onClick={() => setShowGroupSelector(true)}
            className="mt-4 bg-primary text-white py-2 px-4 rounded-full"
          >
            Select Group
          </button>
        </div>
      </div>
    );
  }

  // Game completed screen
  if (gameState.status === 'completed') {
    return (
      <GameCompleted
        onRestart={handleRestart}
        onNewGroup={handleNewGroup}
        reward={currentGroup.reward}
        completedGroups={gameState.completedGroups}
        availableGroups={getAllQuestionGroups()}
      />
    );
  }

  // Game over screen
  if (gameState.status === 'failed') {
    return (
      <GameOver
        correctAnswers={gameState.correctAnswers}
        totalQuestions={currentGroup.questions.length}
        onRestart={handleRestart}
        onNewGroup={handleNewGroup}
        groupTitle={currentGroup.title}
      />
    );
  }

  // Main game screen
  const progress = calculateProgress(gameState.currentQuestion, currentGroup.questions.length);
  
  // Use dynamic question data if available, fallback to base question
  const displayQuestion = currentQuestionData || currentGroup.questions[gameState.currentQuestion];
  
  if (!displayQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Question not found. Please restart the game.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex justify-center px-4 py-4">
      <div className="w-full max-w-2xl">
        <ProgressHeader
          currentQuestion={gameState.currentQuestion}
          totalQuestions={currentGroup.questions.length}
          correctAnswers={gameState.correctAnswers}
          wrongAnswers={gameState.wrongAnswers}
          maxWrong={currentGroup.maxWrong}
          progress={progress}
          groupTitle={currentGroup.title}
        />

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">


          <div className="text-center mb-6">
            <div className="mb-4">
              <span className="w-12 h-12 mx-auto text-primary text-4xl">{displayQuestion.emoji}</span>
            </div>
            <h2 className="text-xl font-medium text-secondary mb-2 leading-relaxed">
              {displayQuestion.title}
              {displayQuestion.id === 8 && scrambledWord && (
                <span className="block mt-2 text-2xl font-mono text-primary">
                  {scrambledWord}
                </span>
              )}
            </h2>
            {displayQuestion.description && (
              <p className="text-sm text-slate-600">
                {displayQuestion.description}
              </p>
            )}
          </div>

          <FeedbackDisplay feedback={feedback} />
          <ErrorDisplay error={error} />

          <div className="space-y-6">
            <input
              type="text"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder={displayQuestion.placeholder}
              className="w-full px-0 py-4 text-slate-800 bg-transparent border-0 border-b-2 border-slate-200 focus:border-primary focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-400 text-lg"
              disabled={isSubmitting || feedback.show}
              onKeyPress={(e) => e.key === 'Enter' && !isSubmitting && !feedback.show && handleSubmitAnswer()}
            />

            <button
              onClick={handleSubmitAnswer}
              disabled={isSubmitting || !currentAnswer.trim() || feedback.show}
              className="w-full bg-primary text-white py-4 px-6 rounded-full font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Validating...
                </span>
              ) : (
                'Submit Answer'
              )}
            </button>
          </div>
        </div>

        <div className="text-center mt-6 text-xs text-slate-400">
          <p>Nyumly 54 • {currentGroup.title}</p>
          <button
            onClick={() => setShowGroupSelector(true)}
            className="mt-2 text-primary hover:underline"
          >
            Switch to different round
          </button>
          {sessionInfo?.isExistingSession && (
            <p className="mt-1 text-green-600">
              ✓ Continuing previous session
            </p>
          )}
        </div>
      </div>
    </div>
  );
}



const QuizGamePage = () => {
  const initialGroupId =  QUESTION_GROUPS[0]?.groupId

  return <QuizGame initialGroupId={initialGroupId} />;
};

export default QuizGamePage;