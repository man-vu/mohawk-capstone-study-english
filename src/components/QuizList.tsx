import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface LatestAttempt {
  attempt_id: number;
  user_id: number;
  quiz_id: number;
  start_time: string;
  time_allowed: number;
  total_questions: number;
  unanswered: number;
  answered: number;
}

interface QuizSummary {
  quiz_id: number;
  title: string;
  skill_id: number;
  description: string;
  is_active: boolean;
  time_allowed: number;
  created_by: number;
  created_at: string;
  skill_description: string;
  attempts: number;
  number_of_questions: number;
  average_rating: number;
  rating_count: number;
  rating_given: number;
  favorite: number;
  latestAttempt?: LatestAttempt;
}

const QuizList: React.FC = () => {
  const { user, openAuthModal } = useAuth();
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT;
  const navigate = useNavigate();

  // Skill icons mapping
  const getSkillIcon = (skillId: number) => {
    const icons = {
      1: '🎧', // Listening
      2: '📖', // Reading
      3: '✍️', // Writing
      4: '🗣️', // Speaking
      5: '📚', // Vocabulary
      6: '📝', // Grammar
    };
    return icons[skillId as keyof typeof icons] || '📋';
  };

  // Skill colors mapping
  const getSkillColor = (skillId: number) => {
    const colors = {
      1: 'bg-blue-500', // Listening
      2: 'bg-green-500', // Reading
      3: 'bg-purple-500', // Writing
      4: 'bg-red-500', // Speaking
      5: 'bg-indigo-500', // Vocabulary
      6: 'bg-yellow-500', // Grammar
    };
    return colors[skillId as keyof typeof colors] || 'bg-gray-500';
  };

  // Get progress percentage for latest attempt
  const getProgressPercentage = (attempt?: LatestAttempt) => {
    if (!attempt || attempt.total_questions === 0) return 0;
    return Math.round((attempt.answered / attempt.total_questions) * 100);
  };

  // Format time
  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Render star rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}>
        ⭐
      </span>
    ));
  };

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
            <div key={quiz.quiz_id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group hover:scale-105">
              {/* Header with skill icon and favorite */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${getSkillColor(quiz.skill_id)} rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-md`}>
                    {getSkillIcon(quiz.skill_id)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {quiz.title}
                    </h3>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                      {quiz.skill_description}
                    </span>
                  </div>
                </div>
                {quiz.favorite === 1 && (
                  <div className="text-red-500 text-lg animate-pulse">
                    ❤️
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 dark:text-gray-300 mb-4 flex-grow leading-relaxed">
                {quiz.description}
              </p>

              {/* Quiz Stats */}
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                    <span>📝</span>
                    <span>Questions:</span>
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {quiz.number_of_questions || 'N/A'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                    <span>⏱️</span>
                    <span>Time:</span>
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatTime(quiz.time_allowed)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                    <span>🎯</span>
                    <span>Attempts:</span>
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {quiz.attempts}
                  </span>
                </div>

                {/* Rating */}
                {quiz.rating_count > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                      <span>⭐</span>
                      <span>Rating:</span>
                    </span>
                    <div className="flex items-center space-x-1">
                      {renderStars(Math.round(quiz.average_rating))}
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        ({quiz.rating_count})
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Latest Attempt Progress (if exists) */}
              {quiz.latestAttempt && (
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                      Latest Progress
                    </span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {getProgressPercentage(quiz.latestAttempt)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(quiz.latestAttempt)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>{quiz.latestAttempt.answered} answered</span>
                    <span>{quiz.latestAttempt.unanswered} remaining</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={() =>
                  user
                    ? navigate(`/practice/${quiz.quiz_id}`)
                    : openAuthModal('login')
                }
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform group-hover:translate-y-0 ${
                  quiz.latestAttempt 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                } hover:scale-105`}
              >
                {quiz.latestAttempt ? (
                  <span className="flex items-center justify-center space-x-2">
                    <span>🔄</span>
                    <span>Continue Quiz</span>
                  </span>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <span>🚀</span>
                    <span>Start Quiz</span>
                  </span>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizList;
