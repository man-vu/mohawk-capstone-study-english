import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ListeningQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'fill-in-blank' | 'match-pair';
  options?: string[];
  answer: string | string[];
}

interface Section {
  id: string;
  title: string;
  instructions: string;
  audioSrc: string;
  description: string;
  questions: ListeningQuestion[];
}

const ListeningTestPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [timeLeft, setTimeLeft] = useState<number>(30 * 60); // 30 minutes
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sections: Section[] = [
    {
      id: 'section1',
      title: 'Section 1',
      instructions: 'You will hear a conversation between two people discussing room rentals. Listen and answer questions 1-10.',
      audioSrc: '/assets/audio/sample-section1.mp3',
      description: 'Conversation between a landlord and potential tenant',
      questions: [
        {
          id: 'q1',
          question: 'The apartment is located on which floor?',
          type: 'multiple-choice',
          options: ['First floor', 'Second floor', 'Third floor', 'Ground floor'],
          answer: 'Second floor'
        },
        {
          id: 'q2',
          question: 'The monthly rent is:',
          type: 'multiple-choice',
          options: ['$650', '$750', '$850', '$950'],
          answer: '$750'
        },
        {
          id: 'q3',
          question: 'The security deposit is equal to:',
          type: 'multiple-choice',
          options: ['Half month rent', 'One month rent', 'Two months rent', 'Three months rent'],
          answer: 'One month rent'
        },
        {
          id: 'q4',
          question: 'Fill in the blank: The apartment is located _______ minutes from the city center.',
          type: 'fill-in-blank',
          answer: '15'
        },
        {
          id: 'q5',
          question: 'Fill in the blank: The minimum lease period is _______ months.',
          type: 'fill-in-blank',
          answer: '6'
        }
      ]
    },
    {
      id: 'section2',
      title: 'Section 2',
      instructions: 'You will hear a radio announcement about a local community event. Listen and answer questions 11-20.',
      audioSrc: '/assets/audio/sample-section2.mp3',
      description: 'Radio announcement about a community festival',
      questions: [
        {
          id: 'q6',
          question: 'When will the festival take place?',
          type: 'multiple-choice',
          options: ['June 10th', 'June 15th', 'July 10th', 'July 15th'],
          answer: 'June 15th'
        },
        {
          id: 'q7',
          question: 'Which of the following activities is NOT mentioned in the announcement?',
          type: 'multiple-choice',
          options: ['Live music', 'Food stalls', 'Art exhibition', 'Sports competition'],
          answer: 'Sports competition'
        },
        {
          id: 'q8',
          question: 'Fill in the blank: The festival opens at _______ in the morning.',
          type: 'fill-in-blank',
          answer: '10'
        },
        {
          id: 'q9',
          question: 'Fill in the blank: Tickets cost _______ dollars for adults.',
          type: 'fill-in-blank',
          answer: '15'
        },
        {
          id: 'q10',
          question: 'Match the following people with their responsibilities:',
          type: 'match-pair',
          options: ['John Smith', 'Mary Johnson', 'David Williams', 'Sarah Taylor'],
          answer: ['Event Coordinator', 'Food Services Manager', 'Security Chief', 'Entertainment Director']
        }
      ]
    },
    {
      id: 'section3',
      title: 'Section 3',
      instructions: 'You will hear a lecture about climate change. Listen and answer questions 21-30.',
      audioSrc: '/assets/audio/sample-section3.mp3',
      description: 'Academic lecture on environmental science',
      questions: [
        {
          id: 'q11',
          question: 'According to the lecture, which of these is the main cause of global warming?',
          type: 'multiple-choice',
          options: ['Solar radiation', 'Greenhouse gases', 'Ocean currents', 'Forest fires'],
          answer: 'Greenhouse gases'
        },
        {
          id: 'q12',
          question: 'The average global temperature has increased by approximately:',
          type: 'multiple-choice',
          options: ['0.5°C since 1900', '1.0°C since 1900', '1.5°C since 1900', '2.0°C since 1900'],
          answer: '1.0°C since 1900'
        },
        {
          id: 'q13',
          question: 'Fill in the blank: Sea levels are rising at a rate of approximately _______ mm per year.',
          type: 'fill-in-blank',
          answer: '3.3'
        },
        {
          id: 'q14',
          question: 'Fill in the blank: The Paris Agreement aims to limit global warming to below _______ degrees Celsius.',
          type: 'fill-in-blank',
          answer: '2'
        },
        {
          id: 'q15',
          question: 'Match the following climate impacts with their regions:',
          type: 'match-pair',
          options: ['Drought', 'Flooding', 'Heat waves', 'Sea level rise'],
          answer: ['Sub-Saharan Africa', 'South Asia', 'Mediterranean', 'Pacific Islands']
        }
      ]
    },
    {
      id: 'section4',
      title: 'Section 4',
      instructions: 'You will hear a discussion between two students about a research project. Listen and answer questions 31-40.',
      audioSrc: '/assets/audio/sample-section4.mp3',
      description: 'Discussion about a university research project',
      questions: [
        {
          id: 'q16',
          question: 'What is the main topic of the research project?',
          type: 'multiple-choice',
          options: ['Urban planning', 'Social media', 'Consumer behavior', 'Environmental sustainability'],
          answer: 'Consumer behavior'
        },
        {
          id: 'q17',
          question: 'How many participants will be involved in the survey?',
          type: 'multiple-choice',
          options: ['150', '250', '350', '450'],
          answer: '250'
        },
        {
          id: 'q18',
          question: 'Fill in the blank: The deadline for the project submission is _______ weeks from now.',
          type: 'fill-in-blank',
          answer: '6'
        },
        {
          id: 'q19',
          question: 'Fill in the blank: The minimum word count for the report is _______ words.',
          type: 'fill-in-blank',
          answer: '3000'
        },
        {
          id: 'q20',
          question: 'Match the following sections with their page allocations in the report:',
          type: 'match-pair',
          options: ['Introduction', 'Literature Review', 'Methodology', 'Results'],
          answer: ['2 pages', '5 pages', '3 pages', '4 pages']
        }
      ]
    }
  ];

  useEffect(() => {
    if (testStarted && !testCompleted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setTestCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [testStarted, testCompleted]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = () => {
    setShowInstructions(false);
    setTestStarted(true);
  };

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSubmitSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
    } else {
      setTestCompleted(true);
    }
  };

  const handleSubmitTest = () => {
    setTestCompleted(true);
  };

  const renderQuestion = (question: ListeningQuestion) => {
    const selectedAnswer = answers[question.id];
    
    switch (question.type) {
      case 'multiple-choice':
        return (
          <div key={question.id} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="mb-3 font-medium text-gray-800 dark:text-gray-200">{question.question}</p>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    id={`${question.id}-${index}`}
                    name={question.id}
                    value={option}
                    checked={selectedAnswer === option}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                  />
                  <label htmlFor={`${question.id}-${index}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'fill-in-blank':
        return (
          <div key={question.id} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="mb-3 font-medium text-gray-800 dark:text-gray-200">{question.question}</p>
            <input
              type="text"
              value={selectedAnswer as string || ''}
              onChange={(e) => handleAnswer(question.id, e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              placeholder="Type your answer here..."
            />
          </div>
        );
        
      case 'match-pair':
        return (
          <div key={question.id} className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <p className="mb-3 font-medium text-gray-800 dark:text-gray-200">{question.question}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                {question.options?.map((item, idx) => (
                  <div key={idx} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-md">
                    <p className="font-medium">{item}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {Array.isArray(question.answer) && question.answer.map((answer, idx) => (
                  <div key={idx} className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-md">
                    <select
                      className="w-full p-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
                      value={(selectedAnswer as string[])?.[idx] || ''}
                      onChange={(e) => {
                        const newAnswers = [...(selectedAnswer as string[] || Array(question.answer.length).fill(''))];
                        newAnswers[idx] = e.target.value;
                        handleAnswer(question.id, newAnswers);
                      }}
                    >
                      <option value="">Select option</option>
                      {question.options?.map((option, optIdx) => (
                        <option key={optIdx} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm">{answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const currentSectionData = sections[currentSection];

  if (testCompleted) {
    // Calculate score
    let correctAnswers = 0;
    let totalQuestions = 0;
    
    sections.forEach(section => {
      section.questions.forEach(question => {
        totalQuestions++;
        const userAnswer = answers[question.id];
        
        if (question.type === 'match-pair') {
          const correctAnswerArray = question.answer;
          const userAnswerArray = userAnswer as string[] || [];
          const correct = question.options?.every(
            (option, idx) => userAnswerArray[idx] === option
          );
          if (correct) correctAnswers++;
        } else if (userAnswer === question.answer) {
          correctAnswers++;
        }
      });
    });
    
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);
    
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
                IELTS Listening Test Results
              </h1>
              
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="w-40 h-40 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                  <p className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                    {scorePercentage}%
                  </p>
                </div>
                <p className="mt-4 text-xl font-medium text-gray-700 dark:text-gray-300">
                  {correctAnswers} out of {totalQuestions} correct
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Performance Analysis</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {scorePercentage >= 90 ? 'Excellent work! You demonstrated exceptional listening comprehension skills.' :
                     scorePercentage >= 70 ? 'Good job! You have strong listening skills, but there\'s still room for improvement.' :
                     scorePercentage >= 50 ? 'You have a basic understanding, but need more practice to improve your listening skills.' :
                     'More practice is needed to develop your listening comprehension skills.'}
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Recommendations</h2>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-1">
                    <li>Practice active listening with English audio on a daily basis</li>
                    <li>Focus on understanding different accents and speaking speeds</li>
                    <li>Take notes effectively during listening exercises</li>
                    <li>Practice with more IELTS listening sample tests</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Try Another Test
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  if (showInstructions) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
                IELTS Listening Test
              </h1>
              
              <div className="space-y-6 mb-8">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Instructions</h2>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
                    <li>The test has four sections, each with 5 questions</li>
                    <li>You will hear each recording only once</li>
                    <li>Answer all questions as you listen</li>
                    <li>The test will last approximately 30 minutes</li>
                    <li>You will have time to review your answers at the end</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Test Format</h2>
                  <ul className="text-gray-600 dark:text-gray-300 space-y-2">
                    <li><span className="font-medium">Section 1:</span> A conversation between two people set in an everyday social context</li>
                    <li><span className="font-medium">Section 2:</span> A monologue set in an everyday social context</li>
                    <li><span className="font-medium">Section 3:</span> A conversation between up to four people set in an educational context</li>
                    <li><span className="font-medium">Section 4:</span> A monologue on an academic subject</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Tips</h2>
                  <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
                    <li>Read the questions before the audio starts playing</li>
                    <li>Pay attention to key words and phrases in the questions</li>
                    <li>Listen for synonyms or paraphrased information</li>
                    <li>Write your answers immediately as you hear them</li>
                    <li>If you miss an answer, continue to the next question</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={handleStartTest}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-medium"
                >
                  Start Test
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="sticky top-16 z-10 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center rounded-t-xl">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{currentSectionData.title}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{currentSectionData.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                timeLeft > 600 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' 
                  : timeLeft > 300 
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
              }`}>
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="mb-6">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-6">
                <p className="text-gray-600 dark:text-gray-300">{currentSectionData.instructions}</p>
              </div>
              
              <div className="mb-6">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Audio</div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {isPlaying ? 'Now playing...' : 'Ready to play'}
                    </p>
                  </div>
                  <button 
                    onClick={handlePlayPause}
                    className="flex-shrink-0 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      {isPlaying ? (
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      )}
                    </svg>
                  </button>
                  <audio 
                    ref={audioRef} 
                    src={currentSectionData.audioSrc} 
                    onEnded={() => setIsPlaying(false)}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                {currentSectionData.questions.map((question) => renderQuestion(question))}
              </div>
            </div>
            
            <div className="flex justify-between">
              {currentSection > 0 && (
                <button
                  onClick={() => setCurrentSection(prev => prev - 1)}
                  className="flex items-center text-purple-600 dark:text-purple-400 hover:underline"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Previous Section
                </button>
              )}
              
              <div className="flex-grow"></div>
              
              {currentSection < sections.length - 1 ? (
                <button
                  onClick={handleSubmitSection}
                  className="flex items-center bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
                >
                  Next Section
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleSubmitTest}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                >
                  Submit Test
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListeningTestPage;