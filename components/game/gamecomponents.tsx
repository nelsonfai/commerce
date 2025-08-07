// components/game/GameComponents.tsx
import React from 'react';
import {
   GlobeAltIcon,
   CheckCircleIcon,
   XCircleIcon,
   TrophyIcon,
   FaceSmileIcon,
   ArrowLeftIcon,
   StarIcon,
   LockClosedIcon,
   SparklesIcon
} from '@heroicons/react/24/outline';
import { FeedbackState } from 'lib/game/utils';
import { QuestionGroup, Question } from 'lib/game/questionGroups';
import Link from 'next/link';

interface EmailPromptProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: () => void;
  totalQuestions: number;
  groupTitle: string;
  groupDescription: string;
}

export const EmailPrompt: React.FC<EmailPromptProps> = ({
   email,
   setEmail,
   onSubmit,
   totalQuestions,
   groupTitle,
   groupDescription
}) => (
  <div className="min-h-screen flex justify-center mt-4 px-4 py-8 ">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="mb-4">
          <GlobeAltIcon className="w-16 h-16 mx-auto text-primary" />
        </div>
        <h1 className="text-4xl font-light text-slate-800 tracking-tight mb-2">
          Nyumly 54
        </h1>
        <p className="text-xl text-slate-600 font-light mb-2">
          {groupTitle}
        </p>
        <p className="text-sm text-slate-500">
          {groupDescription}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <h2 className="text-lg font-medium text-slate-800 mb-4">Want rewards?</h2>
        <p className="text-sm text-slate-600 mb-4">
          Enter your email to receive game perks and track your progress. Or play anonymously.
        </p>          
        <div className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-0 py-3 text-slate-800 bg-transparent border-0 border-b-2 border-slate-200 focus:border-primary focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-400"
          />
                     
          <button
            onClick={onSubmit}
            className="w-full bg-primary text-white py-3 px-6 rounded-full font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 active:scale-[0.98]"
          >
            {email.trim() ? 'Start with Rewards' : 'Play Anonymously'}
          </button>
        </div>
      </div>

      <div className="text-center text-xs text-slate-400">
        <p>🎯 Answer {totalQuestions} questions correctly • ❌ {Math.ceil(totalQuestions / 2)} wrong answers = game over</p>
      </div>
    </div>
  </div>
);

interface GroupSelectorProps {
  availableGroups: QuestionGroup[];
  completedGroups: string[];
  onSelectGroup: (groupId: string) => void;
  onBack: () => void;
}

export const GroupSelector: React.FC<GroupSelectorProps> = ({
  availableGroups,
  completedGroups,
  onSelectGroup,
  onBack
}) => (
  <div className="min-h-screen flex justify-center mt-12 px-4 py-8 bg-gradient-to-br from-slate-50 to-white">
    <div className="w-full max-w-2xl">
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="mr-4 p-2 rounded-full hover:bg-slate-100 transition-colors"
        >
          <ArrowLeftIcon className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-light text-slate-800 tracking-tight">
            Choose Your Challenge
          </h1>
          <p className="text-slate-600">Select a question group to start or continue</p>
        </div>
      </div>

      <div className="grid gap-4">
        {availableGroups.map((group, index) => {
          const isCompleted = completedGroups.includes(group.groupId);
          const isLocked = index > 0 && !completedGroups.includes(availableGroups[index - 1]?.groupId ?? '');
          return (
            <div
              key={group.groupId}
              className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-6 transition-all duration-200 ${
                isLocked
                   ? 'opacity-50 cursor-not-allowed'
                   : 'hover:shadow-md cursor-pointer transform hover:scale-[1.02]'
              }`}
              onClick={() => !isLocked && onSelectGroup(group.groupId)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <h3 className="text-xl font-medium text-slate-800">
                      {group.title}
                    </h3>
                    {isCompleted && (
                      <div className="ml-2 flex items-center text-green-600">
                        <StarIcon className="w-5 h-5 fill-current" />
                      </div>
                    )}
                    {isLocked && (
                      <div className="ml-2">
                        <LockClosedIcon className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                  </div>
                  <p className="text-slate-600 mb-3">{group.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span>🎯 {group.questions.length} questions</span>
                    <span>❌ Max {group.maxWrong} wrong</span>
                    {group.reward && <span>🎁 {group.reward.title}</span>}
                  </div>
                </div>
                <div className="ml-4">
                  {isCompleted ? (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Completed
                    </div>
                  ) : isLocked ? (
                    <div className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-sm font-medium">
                      Locked
                    </div>
                  ) : (
                    <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Start
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/"
          className="text-slate-500 hover:text-slate-700 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  </div>
);

interface GameCompletedProps {
  onRestart: () => void;
  onNewGroup: () => void;
  reward?: {
    title: string;
    description: string;
    level: number;
  };
  completedGroups: string[];
  availableGroups: QuestionGroup[];
}

export const GameCompleted: React.FC<GameCompletedProps> = ({
   onRestart,
   onNewGroup,
   reward,
   completedGroups,
   availableGroups
}) => {
  const hasMoreGroups = completedGroups.length < availableGroups.length;
     
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-50 to-white">
      <div className="w-full max-w-md text-center">
        <div className="text-primary mb-6">
          <TrophyIcon className="w-16 h-16 mx-auto mb-4" />
        </div>
        <h2 className="text-3xl font-light text-slate-800 mb-3 tracking-tight">
          Congratulations!
        </h2>
        <p className="text-slate-600 font-light mb-6">
          You've completed this round of Nyumly 54!
        </p>
                
        {reward && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <h3 className="text-lg font-medium text-slate-800 mb-2">🎁 Your Reward</h3>
            <p className="text-sm text-slate-600 mb-2">{reward.title}</p>
            <p className="text-xs text-slate-500">{reward.description}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <h3 className="text-lg font-medium text-slate-800 mb-2">🏆 Progress</h3>
          <p className="text-sm text-slate-600">
            Completed {completedGroups.length} of {availableGroups.length} rounds
          </p>
          <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
            <div
               className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedGroups.length / availableGroups.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {hasMoreGroups && (
            <button
              onClick={onNewGroup}
              className="w-full bg-primary text-white py-3 px-6 rounded-full font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 active:scale-[0.98]"
            >
              Try Next Round
            </button>
          )}
          <button
            onClick={onRestart}
            className="w-full bg-white text-slate-800 py-3 px-6 rounded-full font-medium border-2 border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
          >
            Play This Round Again
          </button>
          <Link
            href="/"
            className="block w-full bg-white text-slate-800 py-3 px-6 rounded-full font-medium border-2 border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

interface GameOverProps {
  correctAnswers: number;
  totalQuestions: number;
  onRestart: () => void;
  onNewGroup: () => void;
  groupTitle: string;
}

export const GameOver: React.FC<GameOverProps> = ({
   correctAnswers,
   totalQuestions,
   onRestart,
   onNewGroup,
   groupTitle
}) => (
  <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-br from-slate-50 to-white">
    <div className="w-full max-w-md text-center">
      <div className="text-red-500 mb-6">
        <FaceSmileIcon className="w-16 h-16 mx-auto mb-4" />
      </div>
      <h2 className="text-3xl font-light text-slate-800 mb-3 tracking-tight">
        Game Over
      </h2>
      <p className="text-slate-600 font-light mb-6">
        You've made too many incorrect answers. Better luck next time!
      </p>
             
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
        <h3 className="text-lg font-medium text-slate-800 mb-2">Your Progress</h3>
        <p className="text-sm text-slate-600 mb-1">
          Round: {groupTitle}
        </p>
        <p className="text-sm text-slate-600">
          Correct answers: {correctAnswers}/{totalQuestions}
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={onRestart}
          className="w-full bg-primary text-white py-3 px-6 rounded-full font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 active:scale-[0.98]"
        >
          Try Again
        </button>
        <button
          onClick={onNewGroup}
          className="w-full bg-white text-slate-800 py-3 px-6 rounded-full font-medium border-2 border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
        >
          Try Different Round
        </button>
        <Link
          href="/"
          className="block w-full bg-white text-slate-800 py-3 px-6 rounded-full font-medium border-2 border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200"
        >
          Back to Home
        </Link>
      </div>
    </div>
  </div>
);

interface ProgressHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  maxWrong: number;
  progress: number;
  groupTitle: string;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  currentQuestion,
  totalQuestions,
  correctAnswers,
  wrongAnswers,
  maxWrong,
  progress,
  groupTitle
}) => (
  <div className="text-center mb-8">
    <div className="mb-2">
      <h1 className="text-sm font-medium text-slate-600">{groupTitle}</h1>
    </div>
    <div className="flex items-center justify-between mb-4">
      <div className="text-sm text-slate-500">
        Question {currentQuestion + 1}/{totalQuestions}
      </div>
      <div className="flex items-center gap-4 text-sm text-slate-500">
        <div className="flex items-center gap-1">
          <CheckCircleIcon className="w-5 h-5 text-green-500" />
          {correctAnswers}
        </div>
        <div className="flex items-center gap-1">
          <XCircleIcon className="w-5 h-5 text-red-500" />
          {wrongAnswers}/{maxWrong}
        </div>
      </div>
    </div>
         
    <div className="w-full bg-slate-200 rounded-full h-2">
      <div
         className="bg-primary h-2 rounded-full transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
);

interface QuestionDisplayProps {
  question: Question;
  currentAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  currentAnswer,
  onAnswerChange,
  onSubmit,
  isSubmitting
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAnswer.trim() && !isSubmitting) {
      onSubmit();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
      <div className="flex items-start mb-4">
        <div className="text-2xl mr-3 flex-shrink-0">{question.emoji}</div>
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-medium text-slate-800">
              {question.title}
            </h3>
            {question.isDynamic && (
              <div className="ml-2">
                <SparklesIcon className="w-4 h-4 text-amber-500" title="Dynamic Question" />
                <span >Dynamic Question</span>
              </div>
            )}
          </div>
          {question.description && (
            <p className="text-sm text-slate-600 mb-4">{question.description}</p>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={currentAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder={question.placeholder}
          className="w-full px-0 py-3 text-slate-800 bg-transparent border-0 border-b-2 border-slate-200 focus:border-primary focus:outline-none focus:ring-0 transition-colors placeholder:text-slate-400"
          disabled={isSubmitting}
        />
        
        <button
          type="submit"
          disabled={!currentAnswer.trim() || isSubmitting}
          className="w-full bg-primary text-white py-3 px-6 rounded-full font-medium hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
        >
          {isSubmitting ? 'Checking...' : 'Submit Answer'}
        </button>
      </form>
    </div>
  );
};

interface FeedbackDisplayProps {
  feedback: FeedbackState;
}

export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ feedback }) => {
  if (!feedback.show) return null;

  return (
    <div className={`mb-6 p-4 rounded-lg border-l-4 flex items-center space-x-3 ${
      feedback.isCorrect
         ? 'bg-green-50 border-green-400 text-green-700'
         : 'bg-red-50 border-red-400 text-red-700'
    }`}>
      {feedback.isCorrect ? (
        <CheckCircleIcon className="w-5 h-5 flex-shrink-0" />
      ) : (
        <XCircleIcon className="w-5 h-5 flex-shrink-0" />
      )}
      <span className="text-sm font-medium">{feedback.message}</span>
    </div>
  );
};

interface ErrorDisplayProps {
  error: string | null;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm rounded-r flex items-center space-x-3">
      <XCircleIcon className="w-5 h-5 flex-shrink-0" />
      <span>{error}</span>
    </div>
  );
};

interface DynamicQuestionIndicatorProps {
  isDynamic: boolean;
}

export const DynamicQuestionIndicator: React.FC<DynamicQuestionIndicatorProps> = ({ isDynamic }) => {
  if (!isDynamic) return null;

  return (
    <div className="flex items-center justify-center mb-4">
      <div className="bg-amber-50 border border-amber-200 rounded-full px-3 py-1 flex items-center space-x-2">
        <SparklesIcon className="w-4 h-4 text-amber-600" />
        <span className="text-xs font-medium text-amber-700">Dynamic Question</span>
      </div>
    </div>
  );
};