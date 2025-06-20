import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Question {
  question_id: string;
  question: string;
  type_id: number;
  content: any[];
}

interface Answer {
  choice_id?: string;
  sequence_id?: number;
  user_answer: any;
  is_correct_choice?: boolean;
  correct_answer?: string;
  marked: boolean;
}

interface DetailedAnswer {
  answers: Answer[];
}

interface Result {
  accuracy: number;
  detailedAnswers: DetailedAnswer[];
  totalTime?: number;
  totalQuestions?: number;
  correctAnswers?: number;
  incorrectAnswers?: number;
  partiallyCorrect?: number;
  unanswered?: number;
}

interface Props {
  questions: Question[];
  result: Result;
  onRetry?: () => void;
  onSavePractice?: () => void;
  onViewSolutions?: () => void;
}

const EnhancedQuizResults: React.FC<Props> = ({
  questions,
  result,
  onRetry,
  onSavePractice,
  onViewSolutions
}) => {
  const resultLabel = (res: number) => {
    switch (res) {
      case 1:
        return 'Correct';
      case 2:
        return 'Incorrect';
      case 3:
        return 'Partially Correct';
      default:
        return 'Unanswered';
    }
  };

  const computeResult = (answers: any[]) => {
    if (!answers || !answers.length) return 4;
    const hasValue = answers.some(
      (a) =>
        a.user_answer !== undefined &&
        a.user_answer !== null &&
        a.user_answer !== '' &&
        a.user_answer !== 0
    );
    if (!hasValue) return 4;
    const marks = answers.map((a) => a.marked);
    if (marks.every(Boolean)) return 1;
    if (marks.every((m) => !m)) return 2;
    return 3;
  };

  const promptText = (q: any, order: number) =>
    (q.content.find((c: any) => c.prompt_order === order) || {}).left_text || '';

  // Calculate statistics
  const totalQuestions = questions.length;
  const correctAnswers = result.detailedAnswers.filter((detail: any) => 
    detail && detail.answers && computeResult(detail.answers) === 1
  ).length;
  const incorrectAnswers = result.detailedAnswers.filter((detail: any) => 
    detail && detail.answers && computeResult(detail.answers) === 2
  ).length;
  const partiallyCorrect = result.detailedAnswers.filter((detail: any) => 
    detail && detail.answers && computeResult(detail.answers) === 3
  ).length;
  const unanswered = result.detailedAnswers.filter((detail: any) => 
    detail && detail.answers && computeResult(detail.answers) === 4
  ).length;

  const getGradeLabel = (accuracy: number): { label: string; color: string } => {
    if (accuracy >= 90) return { label: 'Excellent', color: 'text-green-600' };
    if (accuracy >= 80) return { label: 'Very Good', color: 'text-green-500' };
    if (accuracy >= 70) return { label: 'Good', color: 'text-blue-500' };
    if (accuracy >= 60) return { label: 'Satisfactory', color: 'text-yellow-500' };
    if (accuracy >= 50) return { label: 'Pass', color: 'text-orange-500' };
    return { label: 'Needs Improvement', color: 'text-red-500' };
  };

  const grade = getGradeLabel(result.accuracy);
  
  return (
    <div className="space-y-8 max-w-3xl mx-auto px-4 py-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Your Quiz Results</h2>
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
            <p className="text-3xl font-bold">{result.accuracy}%</p>
            <p className={`font-medium ${grade.color}`}>{grade.label}</p>
          </div>
          
          {result.totalTime && (
            <div className="flex flex-col items-center md:items-end">
              <p className="text-xl font-medium text-gray-700 dark:text-gray-300">
                Time taken: {Math.floor(result.totalTime / 60)}m {result.totalTime % 60}s
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-xl font-bold">{totalQuestions}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg text-center">
            <p className="text-sm text-green-600 dark:text-green-400">Correct</p>
            <p className="text-xl font-bold text-green-600 dark:text-green-400">{correctAnswers}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg text-center">
            <p className="text-sm text-red-600 dark:text-red-400">Incorrect</p>
            <p className="text-xl font-bold text-red-600 dark:text-red-400">{incorrectAnswers}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-4 rounded-lg text-center">
            <p className="text-sm text-yellow-600 dark:text-yellow-400">Partial</p>
            <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">{partiallyCorrect}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg text-center">
            <p className="text-sm text-blue-600 dark:text-blue-400">Unanswered</p>
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{unanswered}</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {onRetry && (
            <motion.button
              onClick={onRetry}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary rounded-lg px-6 py-2 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </motion.button>
          )}
          
          {onSavePractice && (
            <motion.button
              onClick={onSavePractice}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-secondary rounded-lg px-6 py-2 border border-gray-300 dark:border-gray-600 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save Practice
            </motion.button>
          )}
          
          {onViewSolutions && (
            <motion.button
              onClick={onViewSolutions}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 rounded-lg px-6 py-2 flex items-center justify-center border border-purple-200 dark:border-purple-900"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Solutions
            </motion.button>
          )}
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">Detailed Analysis</h3>
      
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const detail = result.detailedAnswers[idx];
          if (!detail || !detail.answers) return null;
          const computed = computeResult(detail.answers);
          const label = resultLabel(computed);
          const color =
            computed === 1
              ? 'text-green-600 dark:text-green-400'
              : computed === 3
              ? 'text-yellow-600 dark:text-yellow-400'
              : computed === 4
              ? 'text-gray-600 dark:text-gray-400'
              : 'text-red-600 dark:text-red-400';
              
          const bgColor =
            computed === 1
              ? 'bg-green-50 dark:bg-green-900/20'
              : computed === 3
              ? 'bg-yellow-50 dark:bg-yellow-900/20'
              : computed === 4
              ? 'bg-gray-50 dark:bg-gray-700'
              : 'bg-red-50 dark:bg-red-900/20';
              
          return (
            <motion.div
              key={q.question_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${bgColor} p-5 rounded-lg border border-gray-200 dark:border-gray-700`}
            >
              <div className="flex justify-between items-start mb-3">
                <p className="font-medium text-gray-800 dark:text-gray-200">
                  Question {idx + 1}
                </p>
                <span className={`text-sm font-medium px-2 py-1 rounded-full ${bgColor} ${color}`}>
                  {label}
                </span>
              </div>
              
              <p className="text-base font-medium text-gray-800 dark:text-gray-200 mb-4">
                {q.question}
              </p>
              
              {q.type_id === 1 && (
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <p className="font-medium">
                    Your answer:{' '}
                    <span className={computed === 1 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      {detail.answers.some((a: any) => a.user_answer === 1)
                        ? detail.answers
                            .filter((a: any) => a.user_answer === 1)
                            .map(
                              (a: any) =>
                                q.content.find((c: any) => c.choice_id === a.choice_id)?.choice_text
                            )
                            .filter(Boolean)
                            .join(', ')
                        : 'Unanswered'}
                    </span>
                  </p>
                  <p className="font-medium">
                    Correct answer:{' '}
                    <span className="text-green-600 dark:text-green-400">
                      {detail.answers
                        .filter((a: any) => a.is_correct_choice)
                        .map(
                          (a: any) =>
                            q.content.find((c: any) => c.choice_id === a.choice_id)?.choice_text
                        )
                        .filter(Boolean)
                        .join(', ')}
                    </span>
                  </p>
                </div>
              )}
              
              {q.type_id === 2 && (
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {detail.answers.map((a: any, index: number) => (
                    <div key={`${q.question_id}-${a.sequence_id ?? index}`} className="flex items-center">
                      <span className="font-medium mr-2">Gap {a.sequence_id}:</span>
                      {a.user_answer ? (
                        <>
                          <span className={a.marked ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {a.user_answer}
                          </span>
                          <span className="ml-2">
                            {a.marked ? (
                              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <>
                                <svg className="h-5 w-5 inline text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="ml-1 text-green-600 dark:text-green-400">(Correct: {a.correct_answer})</span>
                              </>
                            )}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500">Unanswered</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {q.type_id === 3 && (
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  {detail.answers.map((a: any, index: number) => (
                    <div key={`${q.question_id}-${a.sequence_id ?? index}`} className="flex items-center">
                      <span className="font-medium mr-2">{promptText(q, a.sequence_id)}:</span>
                      {a.user_answer ? (
                        <>
                          <span className={a.marked ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                            {String.fromCharCode(64 + a.user_answer)}
                          </span>
                          <span className="ml-2">
                            {a.marked ? (
                              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <>
                                <svg className="h-5 w-5 inline text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span className="ml-1 text-green-600 dark:text-green-400">(Correct: {a.correct_answer})</span>
                              </>
                            )}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-500">Unanswered</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      <div className="flex justify-center mt-8">
        <Link to="/" className="text-purple-600 dark:text-purple-400 hover:underline flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default EnhancedQuizResults;