import React, { useState } from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';

interface Question {
  question_id: number;
  type_id: number;
  question: string;
  instruction?: string;
  content: any[];
}

interface Props {
  questions: Question[];
}

const PracticeQuiz: React.FC<Props> = ({ questions }) => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = questions[current];

  const handleAnswer = (qid: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const renderQuestion = () => {
    switch (currentQuestion.type_id) {
      case 1:
        return (
          <MultipleChoiceQuestion
            question={currentQuestion as any}
            answer={answers[currentQuestion.question_id]}
            onAnswer={(val) => handleAnswer(currentQuestion.question_id, val)}
          />
        );
      default:
        return <p>Question type not supported.</p>;
    }
  };

  const handlePrev = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };
  const handleNext = () => {
    if (current < questions.length - 1) setCurrent((c) => c + 1);
  };
  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Results</h2>
        {questions.map((q) => (
          <div
            key={q.question_id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">{q.question}</p>
            {answers[q.question_id] !== undefined ? (
              <p className="text-sm text-gray-700 dark:text-gray-300">Your answer: {String(answers[q.question_id])}</p>
            ) : (
              <p className="text-sm text-gray-700 dark:text-gray-300">No answer</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {renderQuestion()}
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={current === 0}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            current === 0
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          Previous
        </button>
        <span className="text-sm">
          Question {current + 1} of {questions.length}
        </span>
        {current < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-6 py-3 rounded-lg font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default PracticeQuiz;
