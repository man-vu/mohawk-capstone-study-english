import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PracticeQuiz from '../components/PracticeQuiz';

interface QuizResponse {
  questions: any[];
  parts: { part_id: number; part_title: string; sort_order: number }[];
  attempt_id: number;
  expired_time: string;
}

const PracticePage: React.FC = () => {
  const { id } = useParams();
  const { user, openAuthModal, isLoading: authLoading } = useAuth();
  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT;
  const [data, setData] = useState<QuizResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Get the current path to determine the quiz type
  const currentPath = window.location.pathname;
  const getQuizTitle = () => {
    if (currentPath.includes('/listening')) return 'Listening Practice';
    if (currentPath.includes('/reading')) return 'Reading Practice';
    if (id) return `Practice Quiz ${id}`;
    return 'Practice Quiz';
  };

  useEffect(() => {
    if (!authLoading && !user) {
      openAuthModal('login');
      setLoading(false);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (!user) {
      return;
    }

    // Handle different route types
    let quizId = id;
    if (currentPath.includes('/listening')) {
      quizId = '1'; // Default listening quiz ID
    } else if (currentPath.includes('/reading')) {
      quizId = '2'; // Default reading quiz ID
    }

    if (!quizId) {
      setError('Quiz ID not found');
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API_URL}quizzes/start/${quizId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
      }
    })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            openAuthModal('login');
            throw new Error('unauthorized');
          }
          throw new Error(res.statusText || 'Request failed');
        }
        return res.json();
      })
      .then(result => {
        if (result.statusCode === 200) {
          setData(result.response);
        } else {
          setError('Failed to load quiz data');
        }
      })
      .catch(err => {
        console.error('Failed to load quiz', err);
        setError('Unable to load quiz. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [API_URL, id, user, currentPath]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Unable to Load Quiz</h3>
          <p className="text-gray-600 dark:text-gray-400">{error || 'Something went wrong while loading the quiz.'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{getQuizTitle()}</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Complete all questions and submit your answers when ready.</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <PracticeQuiz
              questions={data.questions}
              parts={data.parts}
              quizId={Number(id) || (currentPath.includes('/listening') ? 1 : currentPath.includes('/reading') ? 2 : 1)}
              attemptId={data.attempt_id}
              expiresAt={data.expired_time}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
