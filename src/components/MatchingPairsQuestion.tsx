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
  onAnswer: (
    promptOrder: number | null,
    choiceOrder: number,
    fromPrompt?: number
  ) => void;
}

const MatchingPairsQuestion: React.FC<Props> = ({ question, answers, onAnswer }) => {
  const prompts = question.content.filter((c: any) => c.prompt_order !== undefined) as PromptItem[];
  const choices = question.content.filter((c: any) => c.choice_order !== undefined) as ChoiceItem[];
  const shuffledChoices = React.useMemo(() => {
    const arr = [...choices];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [question.question_id]);

  const handleDropOnPrompt = (
    e: React.DragEvent<HTMLDivElement>,
    prompt: number
  ) => {
    e.preventDefault();
    const choice = Number(e.dataTransfer.getData('choice'));
    const fromPromptStr = e.dataTransfer.getData('fromPrompt');
    const fromPrompt = fromPromptStr ? Number(fromPromptStr) : undefined;
    if (!Number.isNaN(choice)) {
      onAnswer(prompt, choice, fromPrompt);
    }
  };

  const handleUnassignDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const choice = Number(e.dataTransfer.getData('choice'));
    const fromPromptStr = e.dataTransfer.getData('fromPrompt');
    const fromPrompt = fromPromptStr ? Number(fromPromptStr) : undefined;
    if (!Number.isNaN(choice) && fromPrompt !== undefined) {
      onAnswer(null, choice, fromPrompt);
    }
  };

  const usedChoices = Object.values(answers);
  const unassignedChoices = shuffledChoices.filter(
    (c) => !usedChoices.includes(c.choice_order)
  );

  const getChoiceText = (order: number) =>
    choices.find((c) => c.choice_order === order)?.right_text || '';

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
                onDrop={(e) => handleDropOnPrompt(e, p.prompt_order)}
                className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800 min-h-[56px]"
              >
                <div className="flex items-start">
                  <span className="font-medium text-purple-700 dark:text-purple-300 mr-2">
                    {p.prompt_order}.
                  </span>
                  <span className="flex-1">{p.left_text}</span>
                </div>
                {answers[p.prompt_order] && (
                  <div
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData(
                        'choice',
                        String(answers[p.prompt_order])
                      );
                      e.dataTransfer.setData(
                        'fromPrompt',
                        String(p.prompt_order)
                      );
                    }}
                    className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center cursor-move transition-transform duration-200 hover:scale-105"
                  >
                    <span className="font-medium text-blue-700 dark:text-blue-300 mr-2">
                      {String.fromCharCode(64 + (answers[p.prompt_order] || 0))}.
                    </span>
                    {getChoiceText(answers[p.prompt_order])}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div onDragOver={(e) => e.preventDefault()} onDrop={handleUnassignDrop}>
          <h5 className="font-medium text-gray-900 dark:text-white mb-4">Right Column</h5>
          <div className="space-y-3">
            {unassignedChoices.map((choice) => (
              <div
                key={choice.choice_order}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('choice', String(choice.choice_order))}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 cursor-move transition-transform duration-200 hover:scale-105"
              >
                <span className="font-medium text-blue-700 dark:text-blue-300 mr-2">{choice.choice_order}.</span>
                {choice.right_text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchingPairsQuestion;
