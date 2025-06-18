import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Separator } from '../components/ui/separator';
import { Star, Clock, Users, BookOpen, Search } from 'lucide-react';

interface Quiz {
  quiz_id: string;
  title: string;
  skill_id: number;
  skill_description: string;
  time_allowed: number;
  attempts: number;
  number_of_questions: number;
  average_rating: number;
  rating_count: number;
  favorite: boolean;
  latestAttempt?: {
    attempt_id: string;
    user_answers: Record<string, string>;
    is_completed: boolean;
  };
}

const PracticeTestsPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedTimeRanges, setSelectedTimeRanges] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [showInStock, setShowInStock] = useState(false);
  const { user } = useAuth();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetchQuizzes();
  }, [API_URL, user]);

  useEffect(() => {
    applyFilters();
  }, [quizzes, searchTerm, selectedSkills, selectedRatings, selectedTimeRanges, selectedDifficulty, priceRange, showInStock]);

  const fetchQuizzes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/quizzes${user ? `?user_id=${user.id}` : ''}`);
      if (response.ok) {
        const data = await response.json();
        setQuizzes(data);
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...quizzes];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quiz.skill_description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Skill filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(quiz => selectedSkills.includes(quiz.skill_id));
    }

    // Rating filter
    if (selectedRatings.length > 0) {
      filtered = filtered.filter(quiz => {
        const rating = Math.floor(quiz.average_rating);
        return selectedRatings.includes(rating);
      });
    }

    // Time range filter
    if (selectedTimeRanges.length > 0) {
      filtered = filtered.filter(quiz => {
        const timeInMinutes = quiz.time_allowed / 60;
        return selectedTimeRanges.some(range => {
          if (range === '0-15') return timeInMinutes <= 15;
          if (range === '15-30') return timeInMinutes > 15 && timeInMinutes <= 30;
          if (range === '30-60') return timeInMinutes > 30 && timeInMinutes <= 60;
          if (range === '60+') return timeInMinutes > 60;
          return false;
        });
      });
    }

    // Difficulty filter (based on number of questions)
    if (selectedDifficulty.length > 0) {
      filtered = filtered.filter(quiz => {
        const difficulty = quiz.number_of_questions <= 10 ? 'Easy' : 
                          quiz.number_of_questions <= 20 ? 'Medium' : 'Hard';
        return selectedDifficulty.includes(difficulty);
      });
    }

    setFilteredQuizzes(filtered);
  };

  const getSkillIcon = (skillId: number) => {
    const icons = { 1: '🎧', 2: '📖', 3: '✍️', 4: '🗣️', 5: '📚', 6: '📝' };
    return icons[skillId as keyof typeof icons] || '📋';
  };

  const getSkillColor = (skillId: number) => {
    const colors = {
      1: 'bg-blue-500', 2: 'bg-green-500', 3: 'bg-purple-500',
      4: 'bg-orange-500', 5: 'bg-pink-500', 6: 'bg-indigo-500'
    };
    return colors[skillId as keyof typeof colors] || 'bg-gray-500';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${minutes}m`;
  };

  const renderStars = (rating: number, count: number) => {
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">({count})</span>
      </div>
    );
  };

  const skillOptions = [
    { id: 1, name: 'Listening' },
    { id: 2, name: 'Reading' },
    { id: 3, name: 'Writing' },
    { id: 4, name: 'Speaking' },
    { id: 5, name: 'Vocabulary' },
    { id: 6, name: 'Grammar' }
  ];

  const handleSkillToggle = (skillId: number) => {
    setSelectedSkills(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  const handleRatingToggle = (rating: number) => {
    setSelectedRatings(prev =>
      prev.includes(rating)
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const handleTimeRangeToggle = (range: string) => {
    setSelectedTimeRanges(prev =>
      prev.includes(range)
        ? prev.filter(r => r !== range)
        : [...prev, range]
    );
  };

  const handleDifficultyToggle = (difficulty: string) => {
    setSelectedDifficulty(prev =>
      prev.includes(difficulty)
        ? prev.filter(d => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search practice tests..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Separator className="my-6" />

              {/* Skills */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Skills</h4>
                {skillOptions.map((skill) => (
                  <div key={skill.id} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`skill-${skill.id}`}
                      checked={selectedSkills.includes(skill.id)}
                      onCheckedChange={() => handleSkillToggle(skill.id)}
                    />
                    <label
                      htmlFor={`skill-${skill.id}`}
                      className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      {skill.name}
                    </label>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Customer Reviews */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Customer Reviews</h4>
                {[4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`rating-${rating}`}
                      checked={selectedRatings.includes(rating)}
                      onCheckedChange={() => handleRatingToggle(rating)}
                    />
                    <label
                      htmlFor={`rating-${rating}`}
                      className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer flex items-center"
                    >
                      {renderStars(rating, 0)}
                      <span className="ml-2">& Up</span>
                    </label>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Time Duration */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Time Duration</h4>
                {['0-15', '15-30', '30-60', '60+'].map((range) => (
                  <div key={range} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`time-${range}`}
                      checked={selectedTimeRanges.includes(range)}
                      onCheckedChange={() => handleTimeRangeToggle(range)}
                    />
                    <label
                      htmlFor={`time-${range}`}
                      className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      {range === '60+' ? '60+ minutes' : `${range} minutes`}
                    </label>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Difficulty */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Difficulty</h4>
                {['Easy', 'Medium', 'Hard'].map((difficulty) => (
                  <div key={difficulty} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`difficulty-${difficulty}`}
                      checked={selectedDifficulty.includes(difficulty)}
                      onCheckedChange={() => handleDifficultyToggle(difficulty)}
                    />
                    <label
                      htmlFor={`difficulty-${difficulty}`}
                      className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      {difficulty}
                    </label>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              {/* Availability */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Availability</h4>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={showInStock}
                    onCheckedChange={(checked) => setShowInStock(checked as boolean)}
                  />
                  <label
                    htmlFor="in-stock"
                    className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                  >
                    Include Out of Stock
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Practice Tests
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {filteredQuizzes.length} results found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <Card key={quiz.quiz_id} className="hover:shadow-lg transition-all duration-300 group hover:scale-105">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 ${getSkillColor(quiz.skill_id)} rounded-lg flex items-center justify-center text-white text-lg font-bold shadow-md`}>
                          {getSkillIcon(quiz.skill_id)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight">
                            {quiz.title}
                          </CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {quiz.skill_description}
                          </Badge>
                        </div>
                      </div>
                      {quiz.favorite && (
                        <span className="text-red-500 text-lg">❤️</span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Rating */}
                    <div className="flex items-center justify-between">
                      {renderStars(Math.floor(quiz.average_rating), quiz.rating_count)}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-300">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-sm font-medium">{quiz.number_of_questions}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Questions</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-300">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">{formatTime(quiz.time_allowed)}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Duration</p>
                      </div>
                    </div>

                    {/* Attempts */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-300">
                        <Users className="w-4 h-4" />
                        <span>{quiz.attempts} attempts</span>
                      </div>
                    </div>

                    {/* Progress Bar (if quiz started) */}
                    {quiz.latestAttempt && !quiz.latestAttempt.is_completed && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                          <span>Progress</span>
                          <span>
                            {Object.keys(quiz.latestAttempt.user_answers).length}/{quiz.number_of_questions}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${(Object.keys(quiz.latestAttempt.user_answers).length / quiz.number_of_questions) * 100}%`
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button 
                      className="w-full mt-4"
                      variant={quiz.latestAttempt && !quiz.latestAttempt.is_completed ? "default" : "outline"}
                      onClick={() => window.location.href = `/practice/${quiz.skill_description.toLowerCase()}`}
                    >
                      {quiz.latestAttempt && !quiz.latestAttempt.is_completed
                        ? '🔄 Continue Quiz'
                        : '🚀 Start Quiz'
                      }
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredQuizzes.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No tests found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticeTestsPage;