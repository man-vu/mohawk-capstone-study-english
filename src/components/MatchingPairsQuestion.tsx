import React from 'react';

interface PromptItem {
  prompt_order: number;
  left_text: string;
}

interface ChoiceItem {
  choice_order: number;
  right_text: string;
}

interface MatchingQuestion {
  question_id: number;
  question: string;
  instruction?: string;
  content: (PromptItem | ChoiceItem)[];
}

interface Props {
  question: MatchingQuestion;
  answers: Record<number, number>;
  onAnswer: (choiceOrder: number, promptOrder: number) => void;
}

const MatchingPairsQuestion: React.FC<Props> = ({ question, answers, onAnswer }) => {
  const prompts = question.content.filter((c: any) => c.prompt_order !== undefined) as PromptItem[];
  const choices = question.content.filter((c: any) => c.choice_order !== undefined) as ChoiceItem[];

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      {question.instruction && (
        <div
          className="mb-4 text-gray-700 dark:text-gray-300"
          dangerouslySetInnerHTML={{ __html: question.instruction }}
        />
      )}
      <p className="text-gray-900 dark:text-white mb-4">{question.question}</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h5 className="font-medium text-gray-900 dark:text-white mb-4">Left Column</h5>
          <div className="space-y-3">
            {prompts.map(p => (
              <div key={p.prompt_order} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <span className="font-medium text-purple-700 dark:text-purple-300">{p.prompt_order}.</span> {p.left_text}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h5 className="font-medium text-gray-900 dark:text-white mb-4">Right Column</h5>
          <div className="space-y-3">
            {choices.map(choice => (
              <div key={choice.choice_order} className="relative">
                <select
                  value={answers[choice.choice_order] || ''}
                  onChange={(e) => onAnswer(choice.choice_order, Number(e.target.value))}
                  className="w-full p-3 rounded-lg border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                >
                  <option value="">-- Select match --</option>
                  {prompts.map(p => (
                    <option key={p.prompt_order} value={p.prompt_order}>
                      {p.prompt_order}: {p.left_text}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="font-medium text-blue-700 dark:text-blue-300">{choice.choice_order}.</span>
                </div>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{choice.right_text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingPairsQuestion;
