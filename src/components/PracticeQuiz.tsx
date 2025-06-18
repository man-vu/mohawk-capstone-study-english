import React, { useState } from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import GapFillingQuestion from './GapFillingQuestion';
import MatchingPairsQuestion from './MatchingPairsQuestion';
import { useAuth } from '../hooks/useAuth';

interface Question {
  question_id: number;
  type_id: number;
  question: string;
  instruction?: string;
  content: any[];
}

interface Props {
  questions: Question[];
  quizId: number;
  attemptId: number;
}

const PracticeQuiz: React.FC<Props> = ({ questions, quizId, attemptId }) => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT || '/api/';
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  const currentQuestion = questions[current];

  const updateAnswer = (questionId: number, answerText: string) => {
    fetch(`${API_URL}questions/answer/${questionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
      },
      body: JSON.stringify({ attemptId, quizId, answerText }),
    }).catch((err) => console.error('update answer', err));
  };

  const handleAnswer = (qid: number, value: any) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
    updateAnswer(qid, String(value));
  };

  const handleGapAnswer = (qid: number, seq: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: { ...(prev[qid] || {}), [seq]: value },
    }));
    const obj = { ...(answers[qid] || {}), [seq]: value };
    const text = Object.keys(obj)
      .sort((a, b) => Number(a) - Number(b))
      .map((k) => `${k}.${obj[k]}`)
      .join(',');
    updateAnswer(qid, text);
  };

  const handleMatchAnswer = (qid: number, prompt: number, choice: number) => {
    const newMap = { ...(answers[qid] || {}), [prompt]: choice };
    setAnswers((prev) => ({
      ...prev,
      [qid]: newMap,
    }));
    const text = Object.keys(newMap)
      .sort((a, b) => Number(a) - Number(b))
      .map((po) => `${po}.${String.fromCharCode(64 + newMap[Number(po)])}`)
      .join(' ');
    updateAnswer(qid, text);
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
      case 2:
        return (
          <GapFillingQuestion
            question={currentQuestion as any}
            answers={answers[currentQuestion.question_id] || {}}
            onAnswer={(seq, val) =>
              handleGapAnswer(currentQuestion.question_id, seq, val)
            }
          />
        );
      case 3:
        return (
          <MatchingPairsQuestion
            question={currentQuestion as any}
            answers={answers[currentQuestion.question_id] || {}}
            onAnswer={(prompt, choice) =>
              handleMatchAnswer(currentQuestion.question_id, prompt, choice)
            }
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
  const handleSubmit = () => {
    fetch(`${API_URL}quizzes/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {}),
      },
      body: JSON.stringify({ quizId, attemptId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setResult(data.response);
          setSubmitted(true);
        }
      })
      .catch((err) => console.error('submit quiz', err));
  };

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
      (a) => a.user_answer !== undefined && a.user_answer !== null && a.user_answer !== '' && a.user_answer !== 0
    );
    if (!hasValue) return 4;
    const marks = answers.map((a) => a.marked);
    if (marks.every(Boolean)) return 1;
    if (marks.every((m) => !m)) return 2;
    return 3;
  };

  const renderResult = (q: any, idx: number) => {
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

    const promptText = (order: number) =>
      (q.content.find((c: any) => c.prompt_order === order) || {}).left_text || '';

    return (
      <div
        key={q.question_id}
        className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <p className="font-medium text-gray-800 dark:text-gray-200 mb-1">{q.question}</p>
        <p className={`text-sm font-medium mb-2 ${color}`}>{label}</p>
        {q.type_id === 1 && (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Your answer:{' '}
            {detail.answers.some((a: any) => a.user_answer === 1)
              ? detail.answers
                  .filter((a: any) => a.user_answer === 1)
                  .map((a: any) =>
                    q.content.find((c: any) => c.choice_id === a.choice_id)?.choice_text
                  )
                  .filter(Boolean)
                  .join(', ')
              : 'Unanswered'}
            {' | '}Correct:{' '}
            {detail.answers
              .filter((a: any) => a.is_correct_choice === 1)
              .map((a: any) => q.content.find((c: any) => c.choice_id === a.choice_id)?.choice_text)
              .filter(Boolean)
              .join(', ')}
          </p>
        )}
        {q.type_id === 2 && (
          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {detail.answers.map((a: any) => (
              <p key={a.sequence_id}>
                Gap {a.sequence_id}:{' '}
                {a.user_answer
                  ? `${a.user_answer} ${a.marked ? '✓' : `✗ (Correct: ${a.correct_answer})`}`
                  : 'Unanswered'}
              </p>
            ))}
          </div>
        )}
        {q.type_id === 3 && (
          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {detail.answers.map((a: any) => (
              <p key={a.sequence_id}>
                {promptText(a.sequence_id)}:{' '}
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
  };

  if (submitted && result) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Results</h2>
        <p className="font-medium text-gray-900 dark:text-white">Score: {result.accuracy}%</p>
        {questions.map((q, idx) => renderResult(q, idx))}
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
