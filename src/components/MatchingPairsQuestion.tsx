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
  onAnswer: (promptOrder: number, choiceOrder: number) => void;
}

const MatchingPairsQuestion: React.FC<Props> = ({ question, answers, onAnswer }) => {
  const prompts = question.content.filter((c: any) => c.prompt_order !== undefined) as PromptItem[];
  const choices = question.content.filter((c: any) => c.choice_order !== undefined) as ChoiceItem[];

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, prompt: number) => {
    e.preventDefault();
    const choice = Number(e.dataTransfer.getData('choice'));
    if (!Number.isNaN(choice)) {
      onAnswer(prompt, choice);
    }
  };

  const usedChoices = Object.values(answers);

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
            {prompts.map((p) => (
              <div
                key={p.prompt_order}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, p.prompt_order)}
                className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 min-h-[56px] flex items-center justify-between"
              >
                <span className="font-medium text-purple-700 dark:text-purple-300 mr-2">{p.prompt_order}.</span>
                <span className="flex-1">{p.left_text}</span>
                {answers[p.prompt_order] && (
                  <span className="ml-2 text-blue-600 dark:text-blue-300 text-sm">
                    {String.fromCharCode(64 + answers[p.prompt_order])}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h5 className="font-medium text-gray-900 dark:text-white mb-4">Right Column</h5>
          <div className="space-y-3">
            {choices.map((choice) => {
              const disabled = usedChoices.includes(choice.choice_order);
              return (
                <div
                  key={choice.choice_order}
                  draggable={!disabled}
                  onDragStart={(e) => e.dataTransfer.setData('choice', String(choice.choice_order))}
                  className={`p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 cursor-move ${disabled ? 'opacity-50' : ''}`}
                >
                  <span className="font-medium text-blue-700 dark:text-blue-300 mr-2">{choice.choice_order}.</span>
                  {choice.right_text}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingPairsQuestion;
