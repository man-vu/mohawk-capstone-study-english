import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import PracticeQuiz from '../components/PracticeQuiz';

interface QuizResponse {
  questions: any[];
  attempt_id: number;
}

const PracticePage: React.FC = () => {
  const { id } = useParams();
  const { user, openAuthModal } = useAuth();
  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT || '/api/';
  const [data, setData] = useState<QuizResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    if (!user) {
      openAuthModal('login');
      setError('Login required');
      return;
    }
    fetch(`${API_URL}quizzes/start/${id}`, {
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
        }
      })
      .catch(err => {
        console.error('Failed to load quiz', err);
        setError('Unable to load quiz. Please try again.');
      });
  }, [API_URL, id, user]);

  if (!data) {
    return (
      <div className="py-20 text-center">
        {error || 'Loading...'}
      </div>
    );
  }

  return (
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz {id}</h2>
        <PracticeQuiz questions={data.questions} quizId={Number(id)} attemptId={data.attempt_id} />
      </div>
  );
};

export default PracticePage;
