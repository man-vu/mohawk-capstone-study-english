import React, { useState } from 'react';

const QuestionTemplates = ({ onBackToHome }) => {
  const [activeTemplate, setActiveTemplate] = useState('multiple-choice');
  const [showResults, setShowResults] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  // Multiple Choice State
  const [mcqAnswers, setMcqAnswers] = useState({});
  
  // Gap Filling State
  const [gapAnswers, setGapAnswers] = useState({});
  
  // Matching State
  const [matchingPairs, setMatchingPairs] = useState({});
  const [currentMatchingSet, setCurrentMatchingSet] = useState(0);

  // Multiple Choice Questions
  const multipleChoiceQuestions = [
    {
      id: 'mc1',
      question: "According to the passage, what is the main advantage of renewable energy sources?",
      passage: "Renewable energy sources such as solar, wind, and hydroelectric power offer numerous benefits over traditional fossil fuels. The most significant advantage is their sustainability - they can be replenished naturally and will not run out. Additionally, they produce minimal greenhouse gas emissions, helping to combat climate change. While the initial investment costs can be high, the long-term operational costs are typically lower than fossil fuel alternatives.",
      options: [
        "A) They have lower initial investment costs",
        "B) They are sustainable and will not run out",
        "C) They are easier to install than fossil fuel systems",
        "D) They work better in all weather conditions"
      ],
      correctAnswer: "B"
    },
    {
      id: 'mc2',
      question: "The author suggests that renewable energy sources have what disadvantage?",
      passage: "Renewable energy sources such as solar, wind, and hydroelectric power offer numerous benefits over traditional fossil fuels. The most significant advantage is their sustainability - they can be replenished naturally and will not run out. Additionally, they produce minimal greenhouse gas emissions, helping to combat climate change. While the initial investment costs can be high, the long-term operational costs are typically lower than fossil fuel alternatives.",
      options: [
        "A) They produce more greenhouse gases",
        "B) They are less reliable than fossil fuels",
        "C) They have high initial investment costs",
        "D) They have higher long-term operational costs"
      ],
      correctAnswer: "C"
    },
    {
      id: 'mc3',
      question: "What is one long-term benefit of renewable energy mentioned in the passage?",
      passage: "Renewable energy sources such as solar, wind, and hydroelectric power offer numerous benefits over traditional fossil fuels. The most significant advantage is their sustainability - they can be replenished naturally and will not run out. Additionally, they produce minimal greenhouse gas emissions, helping to combat climate change. While the initial investment costs can be high, the long-term operational costs are typically lower than fossil fuel alternatives.",
      options: [
        "A) Lower operational costs",
        "B) Easier installation process",
        "C) More consistent energy output",
        "D) Better performance in extreme weather"
      ],
      correctAnswer: "A"
    },
  ];

  // Gap Filling Questions
  const gapFillingQuestions = [
    {
      id: 'gf1',
      title: "Complete the sentences below using NO MORE THAN THREE WORDS from the passage.",
      passage: "The Great Barrier Reef, located off the coast of Australia, is the world's largest coral reef system. It stretches over 2,300 kilometers and consists of approximately 2,900 individual reefs. The reef is home to an incredible diversity of marine life, including over 1,500 species of fish, 400 types of coral, and numerous other sea creatures. Climate change and ocean acidification pose significant threats to this natural wonder.",
      questions: [
        "The Great Barrier Reef is situated _______ Australia.",
        "The reef system extends for more than _______ kilometers.",
        "Over _______ different fish species live in the reef."
      ],
      correctAnswers: ["off the coast of", "2,300", "1,500 species of"]
    },
    {
      id: 'gf2',
      title: "Complete the sentences below using NO MORE THAN TWO WORDS from the passage.",
      passage: "The British Museum in London houses one of the world's most impressive collections of historical artifacts. Founded in 1753, it was the first national public museum in the world. The museum's collection spans over two million years of human history and includes famous objects such as the Rosetta Stone, the Parthenon sculptures, and Egyptian mummies. Every year, approximately six million visitors explore its vast galleries, making it one of the most visited museums globally.",
      questions: [
        "The British Museum was the first _______ museum in the world.",
        "The museum's collection includes artifacts from over _______ of human history.",
        "The British Museum attracts about _______ visitors annually."
      ],
      correctAnswers: ["national public", "two million years", "six million"]
    },
    {
      id: 'gf3',
      title: "Complete the sentences below using NO MORE THAN THREE WORDS from the passage.",
      passage: "Space tourism is rapidly evolving from science fiction to reality. Several private companies are now developing technologies to send civilians into space for short recreational trips. While current prices are prohibitively expensive for most people, analysts predict that costs will decrease significantly within the next decade. The biggest challenges facing the industry include safety concerns, environmental impact, and regulatory frameworks. Despite these obstacles, bookings for future space flights have already exceeded expectations.",
      questions: [
        "Space tourism is changing from science fiction to _______.",
        "The cost of space tourism is expected to _______ in the coming decade.",
        "One major challenge for the industry is _______."
      ],
      correctAnswers: ["reality", "decrease significantly", "safety concerns"]
    },
  ];

  // Matching Questions
  const matchingQuestions = [
    {
      id: 'match1',
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
    },
    {
      id: 'match2',
      title: "Match each literary term with its definition:",
      leftColumn: [
        { id: 'A', text: 'Metaphor' },
        { id: 'B', text: 'Irony' },
        { id: 'C', text: 'Foreshadowing' },
        { id: 'D', text: 'Alliteration' }
      ],
      rightColumn: [
        { id: '1', text: 'Repetition of initial consonant sounds' },
        { id: '2', text: 'Comparison between two unlike things' },
        { id: '3', text: 'Hint of what is to come later in the story' },
        { id: '4', text: 'Contrast between expectation and reality' }
      ],
      correctMatches: { 'A': '2', 'B': '4', 'C': '3', 'D': '1' }
    },
    {
      id: 'match3',
      title: "Match each invention with its country of origin:",
      leftColumn: [
        { id: 'A', text: 'Paper' },
        { id: 'B', text: 'Television' },
        { id: 'C', text: 'World Wide Web' },
        { id: 'D', text: 'Automobile' }
      ],
      rightColumn: [
        { id: '1', text: 'United Kingdom' },
        { id: '2', text: 'China' },
        { id: '3', text: 'Germany' },
        { id: '4', text: 'United States' }
      ],
      correctMatches: { 'A': '2', 'B': '4', 'C': '1', 'D': '3' }
    },
  ];

  // Handler functions for answering questions
  const handleMcqAnswer = (id, value) => {
    setMcqAnswers(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleGapAnswer = (questionId, index, value) => {
    setGapAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        [index]: value
      }
    }));
  };

  const handleMatching = (questionId, leftId, rightId) => {
    setMatchingPairs(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        [leftId]: rightId
      }
    }));
  };

  // Navigation functions
  const handleNextQuestion = () => {
    if (activeTemplate === 'multiple-choice') {
      if (currentQuestion < multipleChoiceQuestions.length - 1) {
        setCurrentQuestion(current => current + 1);
      }
    } else if (activeTemplate === 'gap-filling') {
      if (currentQuestion < gapFillingQuestions.length - 1) {
        setCurrentQuestion(current => current + 1);
      }
    } else if (activeTemplate === 'matching') {
      if (currentMatchingSet < matchingQuestions.length - 1) {
        setCurrentMatchingSet(current => current + 1);
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(current => current - 1);
    } else if (currentMatchingSet > 0) {
      setCurrentMatchingSet(current => current - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const handleNewQuiz = () => {
    setShowResults(false);
    setCurrentQuestion(0);
    setCurrentMatchingSet(0);
    setMcqAnswers({});
    setGapAnswers({});
    setMatchingPairs({});
  };

  const calculateScore = () => {
    let totalCorrect = 0;
    let totalQuestions = 0;

    // Check multiple choice answers
    Object.entries(mcqAnswers).forEach(([id, answer]) => {
      const question = multipleChoiceQuestions.find(q => q.id === id);
      if (question && answer === question.correctAnswer) {
        totalCorrect++;
      }
      totalQuestions++;
    });

    // Check gap filling answers
    Object.entries(gapAnswers).forEach(([questionId, answers]) => {
      const question = gapFillingQuestions.find(q => q.id === questionId);
      if (question) {
        Object.entries(answers).forEach(([index, userAnswer]) => {
          const correctAnswer = question.correctAnswers[index];
          // Simple partial matching for gap filling
          if (userAnswer.toLowerCase().includes(correctAnswer.toLowerCase().split(' ')[0])) {
            totalCorrect++;
          }
          totalQuestions++;
        });
      }
    });

    // Check matching answers
    Object.entries(matchingPairs).forEach(([questionId, pairs]) => {
      const question = matchingQuestions.find(q => q.id === questionId);
      if (question) {
        Object.entries(pairs).forEach(([leftId, rightId]) => {
          if (question.correctMatches[leftId] === rightId) {
            totalCorrect++;
          }
          totalQuestions++;
        });
      }
    });

    return {
      correct: totalCorrect,
      total: totalQuestions,
      percentage: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
    };
  };

  // Render functions for each question type
  const renderMultipleChoice = () => {
    const currentMcq = multipleChoiceQuestions[currentQuestion];
    return (
      <div className="space-y-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reading Passage</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {currentMcq.passage}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Question {currentQuestion + 1}
          </h4>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            {currentMcq.question}
          </p>
          
          <div className="space-y-3">
            {currentMcq.options.map((option, index) => (
              <label 
                key={index} 
                className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <input
                  type="radio"
                  name={`mcq-${currentMcq.id}`}
                  value={option.charAt(0)}
                  checked={mcqAnswers[currentMcq.id] === option.charAt(0)}
                  onChange={(e) => handleMcqAnswer(currentMcq.id, e.target.value)}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-700 dark:text-gray-300">{option}</span>
              </label>
            ))}
          </div>
          
          {!showResults && mcqAnswers[currentMcq.id] && (
            <div className="mt-4 p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400">
              Answer selected! Continue to the next question or submit when done.
            </div>
          )}

          {showResults && mcqAnswers[currentMcq.id] && (
            <div className={`mt-4 p-3 rounded-lg ${mcqAnswers[currentMcq.id] === currentMcq.correctAnswer ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'}`}>
              {mcqAnswers[currentMcq.id] === currentMcq.correctAnswer 
                ? '✅ Correct!' 
                : `❌ Incorrect. The correct answer is ${currentMcq.correctAnswer}.`}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGapFilling = () => {
    const currentGap = gapFillingQuestions[currentQuestion];
    return (
      <div className="space-y-6">
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Reading Passage</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {currentGap.passage}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {currentGap.title}
          </h4>
          
          <div className="space-y-6">
            {currentGap.questions.map((question, index) => {
              const currentAnswers = gapAnswers[currentGap.id] || {};
              const userAnswer = currentAnswers[index] || '';
              const correctAnswer = currentGap.correctAnswers[index];
              const isCorrect = userAnswer.toLowerCase().includes(correctAnswer.toLowerCase().split(' ')[0]);
              
              return (
                <div key={index} className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">{index + 1}.</span> {question}
                  </p>
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => handleGapAnswer(currentGap.id, index, e.target.value)}
                    className="w-full max-w-md p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Type your answer here..."
                  />
                  {showResults && userAnswer && (
                    <div className={`text-sm p-2 rounded ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                      {isCorrect ? '✅ Correct answer!' : `❌ Incorrect. The correct answer is: "${correctAnswer}"`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderMatching = () => {
    const currentMatch = matchingQuestions[currentMatchingSet];
    const currentPairs = matchingPairs[currentMatch.id] || {};
    
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {currentMatch.title}
          </h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-4">Left Column</h5>
              <div className="space-y-3">
                {currentMatch.leftColumn.map((item) => (
                  <div key={item.id} className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                    <span className="font-medium text-purple-700 dark:text-purple-300">{item.id}.</span> {item.text}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-4">Right Column</h5>
              <div className="space-y-3">
                {currentMatch.rightColumn.map((item) => (
                  <div key={item.id} className="relative">
                    <select
                      value={Object.entries(currentPairs).find(([_, rightId]) => rightId === item.id)?.[0] || ''}
                      onChange={(e) => {
                        const leftId = e.target.value;
                        if (leftId) {
                          handleMatching(currentMatch.id, leftId, item.id);
                        }
                      }}
                      className="w-full p-3 rounded-lg border transition-colors 
                        bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 
                        text-gray-700 dark:text-gray-300"
                    >
                      <option value="">-- Match with a left item --</option>
                      {currentMatch.leftColumn.map((leftItem) => (
                        <option 
                          key={leftItem.id} 
                          value={leftItem.id}
                        >
                          {leftItem.id}: {leftItem.text}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <span className="font-medium text-blue-700 dark:text-blue-300">{item.id}.</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {showResults && Object.keys(currentPairs).length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h6 className="font-medium text-gray-900 dark:text-white mb-2">Your Matches:</h6>
              <div className="space-y-1">
                {Object.entries(currentPairs).map(([leftId, rightId]) => (
                  <div key={leftId} className="text-sm">
                    {leftId} → {rightId}:&nbsp;
                    <span className={`${currentMatch.correctMatches[leftId] === rightId ? 
                      'text-green-600 dark:text-green-400' : 
                      'text-red-600 dark:text-red-400'}`}>
                      {currentMatch.correctMatches[leftId] === rightId ? '✅ Correct' : '❌ Incorrect'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render results page
  const renderResults = () => {
    const score = calculateScore();
    
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Your Quiz Results
        </h2>
        
        <div className="mb-8 text-center">
          <div className="w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl font-bold" 
            style={{ 
              background: `conic-gradient(#8b5cf6 ${score.percentage}%, #e5e7eb ${score.percentage}% 100%)` 
            }}>
            <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
              {score.percentage}%
            </div>
          </div>
          
          <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
            You scored {score.correct} out of {score.total} questions
          </p>
        </div>
        
        <div className="space-y-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Performance By Section</h3>
          
          {multipleChoiceQuestions.some(q => mcqAnswers[q.id]) && (
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Multiple Choice Questions</h4>
              <div className="space-y-1">
                {multipleChoiceQuestions.map(q => {
                  const isAnswered = mcqAnswers[q.id];
                  const isCorrect = isAnswered && mcqAnswers[q.id] === q.correctAnswer;
                  
                  return (
                    <div key={q.id} className="flex items-start p-2 rounded-md bg-gray-50 dark:bg-gray-700">
                      <div className="mr-2">
                        {!isAnswered ? '⚪' : (isCorrect ? '✅' : '❌')}
                      </div>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{q.question}</p>
                        {isAnswered && (
                          <p className="text-xs mt-1">
                            Your answer: {mcqAnswers[q.id]} | 
                            {isCorrect ? ' Correct' : ` Correct answer: ${q.correctAnswer}`}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {Object.keys(gapAnswers).length > 0 && (
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Gap Filling Questions</h4>
              <div className="space-y-3">
                {gapFillingQuestions.map(q => {
                  if (!gapAnswers[q.id]) return null;
                  
                  return (
                    <div key={q.id} className="p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                      <p className="text-sm font-medium mb-2">{q.title}</p>
                      <div className="space-y-2">
                        {q.questions.map((question, idx) => {
                          const userAnswer = gapAnswers[q.id]?.[idx] || '';
                          const correctAnswer = q.correctAnswers[idx];
                          const isCorrect = userAnswer.toLowerCase().includes(correctAnswer.toLowerCase().split(' ')[0]);
                          
                          return (
                            <div key={idx} className="flex items-start">
                              <div className="mr-2">
                                {!userAnswer ? '⚪' : (isCorrect ? '✅' : '❌')}
                              </div>
                              <div>
                                <p className="text-xs text-gray-700 dark:text-gray-300">{question}</p>
                                {userAnswer && (
                                  <p className="text-xs mt-1">
                                    Your answer: {userAnswer} | 
                                    {isCorrect ? ' Correct' : ` Correct answer: "${correctAnswer}"`}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
          {Object.keys(matchingPairs).length > 0 && (
            <div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Matching Questions</h4>
              <div className="space-y-3">
                {matchingQuestions.map(q => {
                  if (!matchingPairs[q.id]) return null;
                  
                  const questionPairs = matchingPairs[q.id] || {};
                  const correctCount = Object.entries(questionPairs).filter(
                    ([leftId, rightId]) => q.correctMatches[leftId] === rightId
                  ).length;
                  
                  return (
                    <div key={q.id} className="p-3 rounded-md bg-gray-50 dark:bg-gray-700">
                      <p className="text-sm font-medium mb-2">{q.title}</p>
                      <p className="text-xs mb-2">Score: {correctCount}/{Object.keys(questionPairs).length}</p>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {Object.entries(questionPairs).map(([leftId, rightId]) => {
                          const leftItem = q.leftColumn.find(item => item.id === leftId);
                          const rightItem = q.rightColumn.find(item => item.id === rightId);
                          const isCorrect = q.correctMatches[leftId] === rightId;
                          
                          return (
                            <div key={leftId} className="flex items-center">
                              <div className="mr-1">
                                {isCorrect ? '✅' : '❌'}
                              </div>
                              <div>
                                <p>{leftItem?.text || leftId} → {rightItem?.text || rightId}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleNewQuiz}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Start New Quiz
          </button>
        </div>
      </div>
    );
  };

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
            IELTS Practice Quiz
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Test your IELTS reading skills with different question types. Complete all questions and submit to see your score.
          </p>
        </div>

        {!showResults ? (
          <>
            {/* Template Navigation */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => {
                  setActiveTemplate('multiple-choice');
                  setCurrentQuestion(0);
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTemplate === 'multiple-choice'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Multiple Choice
              </button>
              <button
                onClick={() => {
                  setActiveTemplate('gap-filling');
                  setCurrentQuestion(0);
                }}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTemplate === 'gap-filling'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                Gap Filling
              </button>
              <button
                onClick={() => {
                  setActiveTemplate('matching');
                  setCurrentMatchingSet(0);
                }}
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

            {/* Navigation */}
            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={handlePrevQuestion}
                className={`px-6 py-3 rounded-lg font-medium transition-colors 
                  ${currentQuestion > 0 || currentMatchingSet > 0 
                    ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'}`}
                disabled={currentQuestion === 0 && currentMatchingSet === 0}
              >
                Previous
              </button>

              <div>
                {activeTemplate === 'multiple-choice' && (
                  <span>Question {currentQuestion + 1} of {multipleChoiceQuestions.length}</span>
                )}
                {activeTemplate === 'gap-filling' && (
                  <span>Question {currentQuestion + 1} of {gapFillingQuestions.length}</span>
                )}
                {activeTemplate === 'matching' && (
                  <span>Set {currentMatchingSet + 1} of {matchingQuestions.length}</span>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleNextQuestion}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors 
                    ${(activeTemplate === 'multiple-choice' && currentQuestion < multipleChoiceQuestions.length - 1) ||
                      (activeTemplate === 'gap-filling' && currentQuestion < gapFillingQuestions.length - 1) ||
                      (activeTemplate === 'matching' && currentMatchingSet < matchingQuestions.length - 1)
                        ? 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'}`}
                  disabled={(activeTemplate === 'multiple-choice' && currentQuestion >= multipleChoiceQuestions.length - 1) ||
                           (activeTemplate === 'gap-filling' && currentQuestion >= gapFillingQuestions.length - 1) ||
                           (activeTemplate === 'matching' && currentMatchingSet >= matchingQuestions.length - 1)}
                >
                  Next
                </button>

                <button
                  onClick={handleSubmitQuiz}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          </>
        ) : (
          renderResults()
        )}
      </div>
    </div>
  );
};

export default QuestionTemplates;