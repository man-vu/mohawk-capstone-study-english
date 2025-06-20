import React from 'react';

interface GapItem {
  sequence_id: number;
}

interface GapQuestion {
  question_id: number;
  question: string;
  instruction?: string;
  content: GapItem[];
}

interface Props {
  question: GapQuestion;
  answers: Record<number, string>;
  onAnswer: (sequenceId: number, value: string) => void;
}

const GapFillingQuestion: React.FC<Props> = ({ question, answers, onAnswer }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
    {question.instruction && (
      <div
        className="mb-4 text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: question.instruction }}
      />
    )}
    <p className="text-gray-900 dark:text-white mb-4">{question.question}</p>
    <div className="space-y-4">
      {question.content.map((g, idx) => (
        <input
          key={g.sequence_id}
          type="text"
          value={answers[g.sequence_id] || ''}
          onChange={(e) => onAnswer(g.sequence_id, e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder={`Blank ${idx + 1}`}
        />
      ))}
    </div>
  </div>
);

export default GapFillingQuestion;
