import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface Topic {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  part1Questions: string[];
  part2Topic: string;
  part2Questions: string[];
  part3Questions: string[];
}

const SpeakingPracticePage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [currentPart, setCurrentPart] = useState<1 | 2 | 3>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [recordings, setRecordings] = useState<{ [key: string]: string }>({});
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  
  const topics: Topic[] = [
    {
      id: 'topic1',
      title: 'Work and Career',
      difficulty: 'medium',
      part1Questions: [
        'What kind of work do you do?',
        'Do you enjoy your job? Why or why not?',
        'What are your career plans for the future?',
        'What skills are important in your job?',
        'Have you changed your career goals since you were younger?'
      ],
      part2Topic: 'Describe a job you would like to do in the future.',
      part2Questions: [
        'What the job is',
        'What qualifications you would need',
        'What skills would be helpful',
        'Why you would like to do this job'
      ],
      part3Questions: [
        'How have job requirements changed in your country over the past few decades?',
        'Do you think job satisfaction is more important than salary? Why?',
        'How do you think technology will change the job market in the next 20 years?',
        'What are the most respected professions in your country and why?',
        'Is it better to have the same career for life or to change jobs periodically?'
      ]
    },
    {
      id: 'topic2',
      title: 'Hometown and Accommodation',
      difficulty: 'easy',
      part1Questions: [
        'Where is your hometown?',
        'What is special about your hometown?',
        'How long have you lived there?',
        'Would you like to live somewhere else in the future?',
        'What facilities are there in your area?'
      ],
      part2Topic: 'Describe a house or apartment you would like to live in.',
      part2Questions: [
        'Where it would be',
        'What it would look like inside and outside',
        'Who would live there with you',
        'Why you would like to live in this type of accommodation'
      ],
      part3Questions: [
        'What types of housing are most common in your country?',
        'What are the advantages and disadvantages of living in the city compared to the countryside?',
        'How have houses in your country changed over the past few decades?',
        'Do you think housing problems can be solved by building more houses?',
        'What housing problems exist in your country?'
      ]
    },
    {
      id: 'topic3',
      title: 'Technology and Society',
      difficulty: 'hard',
      part1Questions: [
        'How often do you use technology in your daily life?',
        'What piece of technology could you not live without?',
        'Do you think people rely too much on technology nowadays?',
        'How has technology changed education in your country?',
        'What technological device do you use the most?'
      ],
      part2Topic: 'Describe a piece of technology that has changed your life.',
      part2Questions: [
        'What the technology is',
        'How you use it',
        'How long you have had it',
        'Why it is important to you'
      ],
      part3Questions: [
        'How has technology changed the way people communicate in your country?',
        'Do you think increased use of technology has had more positive or negative effects on society?',
        'Should there be more regulations on technology companies?',
        'How might technology change education in the future?',
        'Do you think artificial intelligence will replace human jobs? Why or why not?'
      ]
    },
    {
      id: 'topic4',
      title: 'Environment and Nature',
      difficulty: 'medium',
      part1Questions: [
        'Do you enjoy spending time in nature?',
        'Are there any environmental problems in your hometown?',
        'What do you do to help protect the environment?',
        'Have attitudes towards environmental issues changed in your country recently?',
        'Would you like to work with environmental issues in the future?'
      ],
      part2Topic: 'Describe a place in nature you enjoy visiting.',
      part2Questions: [
        'Where it is',
        'When you go there',
        'What you do there',
        'Why this place is special to you'
      ],
      part3Questions: [
        'What are the main environmental problems facing your country?',
        'Do you think individuals or governments should take more responsibility for protecting the environment?',
        'How has increased tourism affected the natural environment in your country?',
        'How can we encourage young people to care more about environmental issues?',
        'Do you think economic development and environmental protection can coexist?'
      ]
    }
  ];

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  const handleTopicSelect = (topic: Topic) => {
    setSelectedTopic(topic);
    setShowInstructions(false);
    setCurrentPart(1);
    setCurrentQuestionIndex(0);
    setRecordings({});
    setFeedback(null);
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const recordingId = `${currentPart}_${currentQuestionIndex}`;
        setRecordings(prev => ({
          ...prev,
          [recordingId]: audioUrl
        }));
        
        // Generate automated feedback
        let feedbackText = '';
        if (currentPart === 1) {
          feedbackText = "Good attempt. Try to elaborate more on your answers and use more advanced vocabulary.";
        } else if (currentPart === 2) {
          feedbackText = "Your response includes most required points. Work on organizing your ideas more coherently and using linking words.";
        } else {
          feedbackText = "You've expressed some good ideas. Try to develop your arguments more fully and provide specific examples to support your points.";
        }
        
        setFeedback(feedbackText);
        
        // Release microphone access
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      // Start timer
      setTimer(0);
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      
      // Auto-stop recording after appropriate time based on part
      const recordingTime = currentPart === 1 ? 45 : currentPart === 2 ? 120 : 60;
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          handleStopRecording();
        }
      }, recordingTime * 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check your browser permissions.');
    }
  };
  
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };
  
  const handleNextQuestion = () => {
    if (!selectedTopic) return;
    
    let questions: string[];
    if (currentPart === 1) {
      questions = selectedTopic.part1Questions;
    } else if (currentPart === 2) {
      questions = [selectedTopic.part2Topic]; // Part 2 has only one main topic
    } else {
      questions = selectedTopic.part3Questions;
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Move to next part or finish
      if (currentPart === 1) {
        setCurrentPart(2);
        setCurrentQuestionIndex(0);
      } else if (currentPart === 2) {
        setCurrentPart(3);
        setCurrentQuestionIndex(0);
      } else {
        // Finish practice, show results
        setShowInstructions(true);
        setSelectedTopic(null);
      }
    }
    
    setFeedback(null);
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const getBadgeColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const renderCurrentQuestion = () => {
    if (!selectedTopic) return null;
    
    let questions: string[];
    let promptText: string;
    
    if (currentPart === 1) {
      questions = selectedTopic.part1Questions;
      promptText = "Answer the following question briefly (30-45 seconds):";
    } else if (currentPart === 2) {
      questions = [selectedTopic.part2Topic];
      promptText = "Speak about the following topic for 1-2 minutes. Include all the points below:";
    } else {
      questions = selectedTopic.part3Questions;
      promptText = "Discuss the following question in depth (45-60 seconds):";
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    const recordingId = `${currentPart}_${currentQuestionIndex}`;
    const hasRecording = recordingId in recordings;
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className={`text-xl font-medium ${
            currentPart === 1 
              ? 'text-blue-600 dark:text-blue-400' 
              : currentPart === 2 
                ? 'text-purple-600 dark:text-purple-400' 
                : 'text-green-600 dark:text-green-400'
          }`}>
            Part {currentPart}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
        </div>
        
        <div className="p-5 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{promptText}</p>
          
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">{currentQuestion}</h4>
          
          {currentPart === 2 && (
            <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1 mt-2">
              {selectedTopic.part2Questions.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
          )}
          
          <div className="mt-6">
            {!isRecording && !hasRecording ? (
              <button
                onClick={handleStartRecording}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                Start Recording
              </button>
            ) : isRecording ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-3 w-3 rounded-full bg-red-600 animate-pulse mr-2"></div>
                  <span className="text-gray-700 dark:text-gray-300">Recording... {formatTime(timer)}</span>
                </div>
                
                <button
                  onClick={handleStopRecording}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                  </svg>
                  Stop Recording
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <audio 
                  src={recordings[recordingId]} 
                  controls 
                  className="w-full"
                ></audio>
                
                {feedback && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h5 className="font-medium text-gray-800 dark:text-gray-200 mb-1">Feedback:</h5>
                    <p className="text-gray-700 dark:text-gray-300">{feedback}</p>
                  </div>
                )}
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleStartRecording}
                    className="text-purple-600 dark:text-purple-400 border border-purple-300 dark:border-purple-800 px-4 py-2 rounded-lg flex items-center hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    Try Again
                  </button>
                  
                  <button
                    onClick={handleNextQuestion}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    Next Question
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">IELTS Speaking Practice</h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
            Practice your speaking skills with simulated IELTS test questions
          </p>
        </motion.div>
        
        {showInstructions ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">About the IELTS Speaking Test</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Part 1</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Introduction and interview (4–5 minutes). The examiner asks general questions about familiar topics.
                  </p>
                </div>
                
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Part 2</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Individual long turn (3–4 minutes). You speak for 1–2 minutes on a given topic using a task card.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Part 3</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Discussion (4–5 minutes). The examiner asks questions connected to the topic in Part 2.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Tips for Success</h3>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Speak clearly and at a natural pace</li>
                  <li>Use a variety of vocabulary and grammatical structures</li>
                  <li>Develop your answers with examples and explanations</li>
                  <li>Use discourse markers to organize your ideas</li>
                  <li>Be confident and maintain eye contact</li>
                </ul>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Select a Topic to Practice</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {topics.map(topic => (
                  <div 
                    key={topic.id}
                    onClick={() => handleTopicSelect(topic)}
                    className="bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 p-4 rounded-lg cursor-pointer border border-gray-200 dark:border-gray-600 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{topic.title}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(topic.difficulty)}`}>
                        {topic.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {topic.part1Questions.length + 1 + topic.part3Questions.length} questions
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">How to Use This Practice Tool</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                <li>Select a topic from the options above</li>
                <li>For each question, click "Start Recording" to begin your response</li>
                <li>Your answer will be recorded and automatically stopped after the appropriate time</li>
                <li>Review your recording and feedback</li>
                <li>Practice multiple topics to improve your skills in different areas</li>
              </ol>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedTopic?.title}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Difficulty: <span className={`px-2 py-0.5 rounded-full text-xs ${getBadgeColor(selectedTopic?.difficulty || 'medium')}`}>
                    {selectedTopic?.difficulty}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setShowInstructions(true)}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Topics
              </button>
            </div>
            
            <div className="mb-8 flex justify-between bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => { setCurrentPart(1); setCurrentQuestionIndex(0); }}
                className={`px-4 py-2 rounded-md ${
                  currentPart === 1 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Part 1: Introduction
              </button>
              
              <button
                onClick={() => { setCurrentPart(2); setCurrentQuestionIndex(0); }}
                className={`px-4 py-2 rounded-md ${
                  currentPart === 2 
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Part 2: Long Turn
              </button>
              
              <button
                onClick={() => { setCurrentPart(3); setCurrentQuestionIndex(0); }}
                className={`px-4 py-2 rounded-md ${
                  currentPart === 3 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                Part 3: Discussion
              </button>
            </div>
            
            {renderCurrentQuestion()}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SpeakingPracticePage;