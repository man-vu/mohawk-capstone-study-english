import React, { useState } from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import GapFillingQuestion from './GapFillingQuestion';
import MatchingPairsQuestion from './MatchingPairsQuestion';
import QuizResults from './QuizResults';
import { useAuth } from '../hooks/useAuth';

interface Question {
  question_id: number;
  type_id: number;
  question: string;
  instruction?: string;
  part_id?: number;
  content: any[];
}

interface Part {
  part_id: number;
  part_title: string;
  sort_order: number;
}

const formatTime = (secs: number) => {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

interface Props {
  questions: Question[];
  parts: Part[];
  quizId: number;
  attemptId: number;
  expiresAt: string;
}

const PracticeQuiz: React.FC<Props> = ({ questions, parts, quizId, attemptId, expiresAt }) => {
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT || '/api/';
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    return Math.max(Math.floor(diff / 1000), 0);
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  React.useEffect(() => {
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const partMap = React.useMemo(() => {
    const map: Record<number, string> = {};
    parts.forEach((p) => {
      map[p.part_id] = p.part_title;
    });
    return map;
  }, [parts]);

  const paletteGroups = React.useMemo(() => {
    const groups = parts
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((p) => ({ id: p.part_id, title: p.part_title, indexes: [] as number[] }));
    const other = { id: -1, title: 'Other', indexes: [] as number[] };
    questions.forEach((q, idx) => {
      const g = groups.find((gr) => gr.id === (q.part_id ?? -1));
      if (g) g.indexes.push(idx);
      else other.indexes.push(idx);
    });
    if (other.indexes.length) groups.push(other);
    return groups;
  }, [questions, parts]);

  const isAnswered = (q: Question) => {
    const ans = answers[q.question_id];
    if (q.type_id === 1) {
      return ans !== undefined && ans !== null;
    }
    if (q.type_id === 2) {
      return ans && Object.values(ans).some((v: any) => v && v.trim() !== '');
    }
    if (q.type_id === 3) {
      return ans && Object.keys(ans).length > 0;
    }
    return false;
  };

  const currentQuestion = questions[current];
  const currentPartTitle = currentQuestion.part_id ? partMap[currentQuestion.part_id] : undefined;

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

  const handleMatchAnswer = (
    qid: number,
    prompt: number | null,
    choice: number,
    fromPrompt?: number
  ) => {
    const prevMap = answers[qid] || {};
    const newMap: Record<number, number> = { ...prevMap };
    if (fromPrompt !== undefined) {
      delete newMap[fromPrompt];
    }
    Object.keys(newMap).forEach((po) => {
      if (newMap[Number(po)] === choice) delete newMap[Number(po)];
    });
    if (prompt !== null) {
      newMap[prompt] = choice;
    }
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
            onAnswer={(prompt, choice, from) =>
              handleMatchAnswer(currentQuestion.question_id, prompt, choice, from)
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


  if (submitted && result) {
    return <QuizResults questions={questions} result={result} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        {currentPartTitle && (
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {currentPartTitle}
          </h3>
        )}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Time Left: {formatTime(timeLeft)}
        </span>
      </div>
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
      <div className="mt-8 space-y-4">
        {paletteGroups.map((group, gi) => (
          <div key={gi}>
            <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
              {group.title}
            </h4>
            <div className="flex flex-wrap gap-2">
              {group.indexes.map((idx) => {
                const q = questions[idx];
                const answered = isAnswered(q);
                const isCurrent = idx === current;
                return (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`w-8 h-8 rounded-full text-sm flex items-center justify-center font-medium border transition-colors ${
                      isCurrent
                        ? 'bg-purple-600 text-white border-purple-600'
                        : answered
                        ? 'bg-green-500 text-white border-green-500'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PracticeQuiz;
