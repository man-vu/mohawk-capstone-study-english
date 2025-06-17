import React from 'react';

const Hero = ({ onExploreTests }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-800 dark:to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Master IELTS with
            <span className="block text-yellow-300">Expert-Designed Tests</span>
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
            Achieve your target IELTS score with our comprehensive practice tests, 
            expert feedback, and personalized study plans. Join thousands of successful students worldwide.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={onExploreTests}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-lg text-lg font-semibold transition-colors w-full sm:w-auto"
            >
              Start Free Practice Test
            </button>
            <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold transition-colors w-full sm:w-auto">
              View Study Plans
            </button>
          </div>
          <div className="mt-12 flex justify-center items-center space-x-8 text-white">
            <div className="text-center">
              <div className="text-3xl font-bold">50,000+</div>
              <div className="text-sm text-gray-200">Students Trained</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4.8★</div>
              <div className="text-sm text-gray-200">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">95%</div>
              <div className="text-sm text-gray-200">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;