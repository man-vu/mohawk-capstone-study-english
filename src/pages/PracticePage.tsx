import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface QuizResponse {
  questions: any[];
}

const PracticePage: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT || '/api/';
  const [data, setData] = useState<QuizResponse | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`${API_URL}quizzes/start/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(user?.token ? { Authorization: `Bearer ${user.token}` } : {})
      }
    })
      .then(res => res.json())
      .then(result => {
        if (result.statusCode === 200) {
          setData(result.response);
        }
      })
      .catch(err => {
        console.error('Failed to load quiz', err);
      });
  }, [API_URL, id, user]);

  if (!data) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Quiz {id}</h2>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto text-sm">
        {JSON.stringify(data.questions, null, 2)}
      </pre>
    </div>
  );
};

export default PracticePage;
