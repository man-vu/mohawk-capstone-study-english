import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface QuizSummary {
  quiz_id: number;
  title: string;
  description: string;
}

const QuizList: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT || '/api/';
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}home`, {
      headers: {
        'Content-Type': 'application/json',
        ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.statusCode === 200) {
          setQuizzes(data.response);
        }
      })
      .catch(err => {
        console.error('Failed to load quizzes', err);
      });
  }, [API_URL, user]);

  if (!quizzes.length) {
    return null;
  }

  return (
    <div className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Practice Quizzes
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map(quiz => (
            <div key={quiz.quiz_id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {quiz.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 flex-grow">
                {quiz.description}
              </p>
              <button
                onClick={() =>
                  user
                    ? navigate(`/practice/${quiz.quiz_id}`)
                    : openAuthModal('login')
                }
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Start Quiz
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizList;
