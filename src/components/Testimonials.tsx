import React from 'react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      score: 'IELTS 8.5',
      country: 'China',
      text: 'IELTS Master helped me achieve my dream score! The practice tests were exactly like the real exam, and the feedback was incredibly detailed.',
      image: '👩‍🎓'
    },
    {
      name: 'Ahmed Hassan',
      score: 'IELTS 7.5',
      country: 'Egypt',
      text: 'The speaking practice feature was a game-changer. I went from being nervous to confident in just 3 months of preparation.',
      image: '👨‍💼'
    },
    {
      name: 'Maria Rodriguez',
      score: 'IELTS 8.0',
      country: 'Spain',
      text: 'Excellent platform with comprehensive materials. The progress tracking helped me identify my weak areas and improve systematically.',
      image: '👩‍🔬'
    },
    {
      name: 'Raj Patel',
      score: 'IELTS 7.0',
      country: 'India',
      text: 'As a working professional, the flexible study schedule was perfect. I could practice during my commute and lunch breaks.',
      image: '👨‍💻'
    }
  ];

  return (
    <div className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Students Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Real success stories from students who achieved their IELTS goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">{testimonial.image}</div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                    {testimonial.name}
                  </h4>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium text-green-600 dark:text-green-400 mr-2">
                      {testimonial.score}
                    </span>
                    • {testimonial.country}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                "{testimonial.text}"
              </p>
              <div className="mt-4 flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
