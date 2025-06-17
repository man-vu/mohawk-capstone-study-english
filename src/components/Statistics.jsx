import React from 'react';

const Statistics = () => {
  const stats = [
    {
      number: '50,000+',
      label: 'Students Worldwide',
      description: 'Trust our platform for their IELTS preparation'
    },
    {
      number: '1,000+',
      label: 'Practice Tests',
      description: 'Comprehensive collection covering all IELTS sections'
    },
    {
      number: '95%',
      label: 'Success Rate',
      description: 'Students achieve their target IELTS scores'
    },
    {
      number: '4.8/5',
      label: 'Average Rating',
      description: 'Based on verified student reviews'
    }
  ];

  return (
    <div className="py-20 bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-800 dark:to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Students Globally
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Join the community of successful IELTS test-takers who chose our platform
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">
                {stat.number}
              </div>
              <div className="text-xl font-semibold text-white mb-2">
                {stat.label}
              </div>
              <div className="text-gray-200 text-sm">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;