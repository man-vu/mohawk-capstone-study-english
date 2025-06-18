import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    {
      title: 'Listening Tests',
      description: 'Practice with authentic audio materials and various accent types',
      tests: '250+ Tests',
      icon: '🎧',
      color: 'bg-blue-500',
      link: '/listening'
    },
    {
      title: 'Reading Tests',
      description: 'Academic and General Training reading passages with time management',
      tests: '300+ Tests',
      icon: '📖',
      color: 'bg-green-500',
      link: '/reading'
    },
    {
      title: 'Writing Tasks',
      description: 'Task 1 & Task 2 practice with expert evaluation and feedback',
      tests: '200+ Tasks',
      icon: '✍️',
      color: 'bg-purple-500',
      link: '/writing-test'
    },
    {
      title: 'Speaking Practice',
      description: 'Mock interviews with AI feedback and pronunciation analysis',
      tests: '150+ Topics',
      icon: '🗣️',
      color: 'bg-red-500',
      link: '/speaking-practice'
    },
    {
      title: 'Full Mock Tests',
      description: 'Complete IELTS simulation under timed conditions',
      tests: '50+ Tests',
      icon: '📋',
      color: 'bg-yellow-500',
      link: '/full-mock-tests'
    },
    {
      title: 'Vocabulary Builder',
      description: 'Essential IELTS vocabulary with contextual examples',
      tests: '2000+ Words',
      icon: '📚',
      color: 'bg-indigo-500',
      link: '/flashcards'
    },
    {
      title: 'Vocabulary Games',
      description: 'Fun games to help memorize IELTS vocabulary',
      tests: '3+ Games',
      icon: '🎮',
      color: 'bg-pink-500',
      link: '/vocabulary-games'
    }
  ];

  return (
    <div className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Comprehensive IELTS Preparation
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Master all four IELTS skills with our extensive collection of practice materials
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link key={index} to={category.link} className="group cursor-pointer">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all duration-300 group-hover:border-purple-300 dark:group-hover:border-purple-600">
                <div className={`${category.color} w-12 h-12 rounded-lg flex items-center justify-center text-white text-2xl mb-4`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {category.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {category.tests}
                  </span>
                  <span className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-medium text-sm group-hover:translate-x-1 transition-transform">
                    Start Practice →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
