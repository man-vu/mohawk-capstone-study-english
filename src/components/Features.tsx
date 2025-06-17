import React from 'react';

const Features = () => {
  const features = [
    {
      icon: '📝',
      title: 'Authentic Practice Tests',
      description: 'Real IELTS format tests designed by certified examiners with detailed explanations.'
    },
    {
      icon: '🎯',
      title: 'Personalized Feedback',
      description: 'Get instant scores and detailed feedback on your performance across all four skills.'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Monitor your improvement with comprehensive analytics and performance insights.'
    },
    {
      icon: '👨‍🏫',
      title: 'Expert Instructors',
      description: 'Learn from certified IELTS trainers with years of teaching experience.'
    },
    {
      icon: '📱',
      title: 'Mobile Learning',
      description: 'Practice anytime, anywhere with our responsive platform on all devices.'
    },
    {
      icon: '🏆',
      title: 'Proven Results',
      description: 'Join thousands of students who achieved their target IELTS scores with us.'
    }
  ];

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose IELTS Master?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need to ace the IELTS exam in one comprehensive platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
