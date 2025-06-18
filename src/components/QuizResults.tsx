import React from 'react';

interface Props {
  questions: any[];
  result: any;
}

const QuizResults: React.FC<Props> = ({ questions, result }) => {
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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Results</h2>
      <p className="font-medium text-gray-900 dark:text-white">
        Score: {result.accuracy}%
      </p>
      {questions.map((q, idx) => {
        const detail = result.detailedAnswers[idx];
        if (!detail || !detail.answers) return null;
        const computed = computeResult(detail.answers);
        const label = resultLabel(computed);
        const color =
          computed === 1
            ? 'text-green-600'
            : computed === 3
            ? 'text-yellow-600'
            : computed === 4
            ? 'text-gray-600'
            : 'text-red-600';
        return (
          <div
            key={q.question_id}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">
              {q.question}
            </p>
            <p className={`text-sm font-medium mb-2 ${color}`}>{label}</p>
            {q.type_id === 1 && (
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Your answer:{' '}
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
                {' | '}Correct:{' '}
                {detail.answers
                  .filter((a: any) => a.is_correct_choice === 1)
                  .map(
                    (a: any) =>
                      q.content.find((c: any) => c.choice_id === a.choice_id)?.choice_text
                  )
                  .filter(Boolean)
                  .join(', ')}
              </p>
            )}
            {q.type_id === 2 && (
              <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {detail.answers.map((a: any) => (
                  <p key={`${q.question_id}-${a.sequence_id}`}>
                    Gap {a.sequence_id}:{' '}
                    {a.user_answer
                      ? `${a.user_answer} ${
                          a.marked ? '✓' : `✗ (Correct: ${a.correct_answer})`
                        }`
                      : 'Unanswered'}
                  </p>
                ))}
              </div>
            )}
            {q.type_id === 3 && (
              <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                {detail.answers.map((a: any) => (
                  <p key={`${q.question_id}-${a.sequence_id}`}> 
                    {promptText(q, a.sequence_id)}:{' '}
                    {a.user_answer
                      ? `${String.fromCharCode(64 + a.user_answer)} ${
                          a.marked ? '✓' : `✗ (Correct: ${a.correct_answer})`
                        }`
                      : 'Unanswered'}
                  </p>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default QuizResults;
