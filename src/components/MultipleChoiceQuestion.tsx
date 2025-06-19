import React from 'react';

interface Choice {
  choice_id: number;
  choice_text: string;
}

interface MCQuestion {
  question_id: number;
  question: string;
  instruction?: string;
  content: Choice[];
}

interface Props {
  question: MCQuestion;
  answer?: number;
  onAnswer: (choiceId: number) => void;
}

const MultipleChoiceQuestion: React.FC<Props> = ({ question, answer, onAnswer }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
    {question.instruction && (
      <div
        className="mb-4 text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: question.instruction }}
      />
    )}
    <p className="text-gray-900 dark:text-white font-medium mb-4">{question.question}</p>
    <div className="space-y-3">
      {question.content.map((choice) => (
        <label
          key={choice.choice_id}
          className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <input
            type="radio"
            name={`q-${question.question_id}`}
            value={choice.choice_id}
            checked={answer === choice.choice_id}
            onChange={() => onAnswer(choice.choice_id)}
            className="text-purple-600 focus:ring-purple-500"
          />
          <span className="text-gray-700 dark:text-gray-300">{choice.choice_text}</span>
        </label>
      ))}
    </div>
  </div>
);

export default MultipleChoiceQuestion;
