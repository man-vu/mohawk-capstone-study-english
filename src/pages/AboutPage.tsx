import React from 'react';
import { motion } from 'framer-motion';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">About IELTS Master</h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Your comprehensive companion for IELTS success</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Our Mission</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                At IELTS Master, we're dedicated to helping learners worldwide achieve their desired IELTS scores through comprehensive, 
                accessible, and effective study materials. Our platform combines expert-designed practice tests, vocabulary building tools, 
                and personalized study plans to address the unique challenges of the IELTS exam.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">What Sets Us Apart</h2>
              <ul className="mt-4 space-y-3 text-lg text-gray-600 dark:text-gray-300">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>AI-powered learning tools that adapt to your progress</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Comprehensive coverage of all IELTS modules: Reading, Writing, Listening, and Speaking</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Personalized study plans based on your target score</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-purple-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Regular updates with fresh practice materials</span>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Our Approach</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                We believe in learning by doing. Our platform focuses on interactive practice that simulates real exam conditions, 
                while providing detailed feedback to help you understand and improve. With thousands of practice questions, 
                vocabulary items, and realistic mock tests, IELTS Master gives you the confidence and skills needed to excel.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Meet Our Team</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Our team consists of experienced IELTS trainers, language specialists, and education technology experts who 
                understand the challenges students face when preparing for the IELTS exam. We're continuously working to improve 
                our platform based on the latest research in language acquisition and assessment.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Contact Us</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Have questions or feedback? We'd love to hear from you! Reach out to our support team at 
                <a href="mailto:support@ieltsmaster.com" className="text-purple-600 dark:text-purple-400 hover:underline ml-1">
                  support@ieltsmaster.com
                </a>
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Start Your IELTS Journey Today</h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
            Join thousands of successful students who have achieved their target IELTS scores with our help.
          </p>
          <div className="mt-8">
            <button
              onClick={() => window.location.href = '/study-plans'}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition-colors"
            >
              Create Your Study Plan
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;