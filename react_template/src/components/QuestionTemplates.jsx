import React, { useState } from 'react';

const QuestionTemplates = ({ onBackToHome }) => {
  const [activeTemplate, setActiveTemplate] = useState('multiple-choice');
  const [mcqAnswer, setMcqAnswer] = useState('');
  const [gapAnswers, setGapAnswers] = useState(['', '', '']);
  const [matchingPairs, setMatchingPairs] = useState({});

  const multipleChoiceQuestion = {
    question: "According to the passage, what is the main advantage of renewable energy sources?",
    passage: "Renewable energy sources such as solar, wind, and hydroelectric power offer numerous benefits over traditional fossil fuels. The most significant advantage is their sustainability - they can be replenished naturally and will not run out. Additionally, they produce minimal greenhouse gas emissions, helping to combat climate change. While the initial investment costs can be high, the long-term operational costs are typically lower than fossil fuel alternatives.",
    options: [
      "A) They have lower initial investment costs",
      "B) They are sustainable and will not run out",
      "C) They are easier to install than fossil fuel systems",
      "D) They work better in all weather conditions"
    ],
    correctAnswer: "B"
  };

  const gapFillingQuestion = {
    title: "Complete the sentences below using NO MORE THAN THREE WORDS from the passage.",
    passage: "The Great Barrier Reef, located off the coast of Australia, is the world's largest coral reef system. It stretches over 2,300 kilometers and consists of approximately 2,900 individual reefs. The reef is home to an incredible diversity of marine life, including over 1,500 species of fish, 400 types of coral, and numerous other sea creatures. Climate change and ocean acidification pose significant threats to this natural wonder.",
    questions: [
      "The Great Barrier Reef is situated _______ Australia.",
      "The reef system extends for more than _______ kilometers.",
      "Over _______ different fish species live in the reef."
    ],
    correctAnswers: ["off the coast of", "2,300", "1,500 species of"]
  };

  const matchingQuestion = {
    title: "Match each environmental problem with its primary cause:",
    leftColumn: [
      { id: 'A', text: 'Deforestation' },
      { id: 'B', text: 'Ocean acidification' },
      { id: 'C', text: 'Air pollution' },
      { id: 'D', text: 'Soil erosion' }
    ],
    rightColumn: [
      { id: '1', text: 'Industrial emissions and vehicle exhaust' },
      { id: '2', text: 'Excessive CO2 absorption by seawater' },
      { id: '3', text: 'Agricultural expansion and logging' },
      { id: '4', text: 'Overgrazing and intensive farming' }
    ],
    correctMatches: { 'A': '3', 'B': '2', 'C': '1', 'D': '4' }
  };

  const handleGapAnswer = (index, value) => {
    const newAnswers = [...gapAnswers];
    newAnswers[index] = value;
    setGapAnswers(newAnswers);
  };

  const handleMatching = (leftId, rightId) => {
    setMatchingPairs(prev => ({
      ...prev,
      [leftId]: rightId
    }));
  };

  const renderMultipleChoice = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reading Passage</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {multipleChoiceQuestion.passage}
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Question 1
        </h4>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          {multipleChoiceQuestion.question}
        </p>
        
        <div className="space-y-3">
          {multipleChoiceQuestion.options.map((option, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="radio"
                name="mcq"
                value={option.charAt(0)}
                checked={mcqAnswer === option.charAt(0)}
                onChange={(e) => setMcqAnswer(e.target.value)}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="text-gray-700 dark:text-gray-300">{option}</span>
            </label>
          ))}
        </div>
        
        {mcqAnswer && (
          <div className={`mt-4 p-3 rounded-lg ${mcqAnswer === multipleChoiceQuestion.correctAnswer ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'}`}>
            {mcqAnswer === multipleChoiceQuestion.correctAnswer ? '✅ Correct!' : '❌ Incorrect. The correct answer is B.'}
          </div>
        )}
      </div>
    </div>
  );

  const renderGapFilling = () => (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reading Passage</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {gapFillingQuestion.passage}
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {gapFillingQuestion.title}
        </h4>
        
        <div className="space-y-6">
          {gapFillingQuestion.questions.map((question, index) => (
            <div key={index} className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <span className="font-medium">{index + 1}.</span> {question}
              </p>
              <input
                type="text"
                value={gapAnswers[index]}
                onChange={(e) => handleGapAnswer(index, e.target.value)}
                className="w-full max-w-md p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Type your answer here..."
              />
              {gapAnswers[index] && (
                <div className={`text-sm p-2 rounded ${gapAnswers[index].toLowerCase().includes(gapFillingQuestion.correctAnswers[index].toLowerCase().split(' ')[0]) ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  {gapAnswers[index].toLowerCase().includes(gapFillingQuestion.correctAnswers[index].toLowerCase().split(' ')[0]) ? '✅ Good answer!' : '💡 Hint: Check the passage again'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderMatching = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          {matchingQuestion.title}
        </h4>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-4">Problems</h5>
            <div className="space-y-3">
              {matchingQuestion.leftColumn.map((item) => (
                <div key={item.id} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <span className="font-medium text-purple-700 dark:text-purple-300">{item.id}.</span> {item.text}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h5 className="font-medium text-gray-900 dark:text-white mb-4">Causes</h5>
            <div className="space-y-3">
              {matchingQuestion.rightColumn.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    // Simple matching logic - match with selected left item
                    const selectedLeft = Object.keys(matchingPairs).find(key => !Object.values(matchingPairs).includes(item.id));
                    if (selectedLeft) {
                      handleMatching(selectedLeft, item.id);
                    } else {
                      // If no left item selected, match with first available
                      const availableLeft = matchingQuestion.leftColumn.find(left => !matchingPairs[left.id]);
                      if (availableLeft) {
                        handleMatching(availableLeft.id, item.id);
                      }
                    }
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    Object.values(matchingPairs).includes(item.id)
                      ? 'bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
                      : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <span className="font-medium text-blue-700 dark:text-blue-300">{item.id}.</span> {item.text}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {Object.keys(matchingPairs).length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h6 className="font-medium text-gray-900 dark:text-white mb-2">Your Matches:</h6>
            <div className="space-y-1">
              {Object.entries(matchingPairs).map(([left, right]) => (
                <div key={left} className="text-sm text-gray-600 dark:text-gray-300">
                  {left} → {right} {matchingQuestion.correctMatches[left] === right ? '✅' : '❌'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={onBackToHome}
            className="flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            IELTS Question Templates
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Explore different types of IELTS questions and practice with interactive examples.
          </p>
        </div>

        {/* Template Navigation */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setActiveTemplate('multiple-choice')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTemplate === 'multiple-choice'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Multiple Choice
          </button>
          <button
            onClick={() => setActiveTemplate('gap-filling')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTemplate === 'gap-filling'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Gap Filling
          </button>
          <button
            onClick={() => setActiveTemplate('matching')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTemplate === 'matching'
                ? 'bg-purple-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            Matching Pairs
          </button>
        </div>

        {/* Question Content */}
        <div>
          {activeTemplate === 'multiple-choice' && renderMultipleChoice()}
          {activeTemplate === 'gap-filling' && renderGapFilling()}
          {activeTemplate === 'matching' && renderMatching()}
        </div>
      </div>
    </div>
  );
};

export default QuestionTemplates;