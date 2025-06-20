import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import WritingTask from '../components/quiz/WritingTask';
import WritingFeedback from '../components/quiz/WritingFeedback';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Clock, BookOpen, FileText, CheckCircle } from 'lucide-react';

interface WritingSession {
  task1: {
    content: string;
    wordCount: number;
    timeSpent: number;
    completed: boolean;
  };
  task2: {
    content: string;
    wordCount: number;
    timeSpent: number;
    completed: boolean;
  };
  totalTime: number;
  isStarted: boolean;
  isCompleted: boolean;
}

const WritingTestPage: React.FC = () => {
  const { user } = useAuth();
  const [currentTask, setCurrentTask] = useState<1 | 2>(1);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackData, setFeedbackData] = useState<{
    content: string;
    taskType: 'Academic Task 1' | 'Academic Task 2';
    wordCount: number;
  } | null>(null);
  const [session, setSession] = useState<WritingSession>({
    task1: { content: '', wordCount: 0, timeSpent: 0, completed: false },
    task2: { content: '', wordCount: 0, timeSpent: 0, completed: false },
    totalTime: 0,
    isStarted: false,
    isCompleted: false
  });
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && session.isStarted && !session.isCompleted) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
        setSession(prev => ({
          ...prev,
          totalTime: prev.totalTime + 1,
          [`task${currentTask}`]: {
            ...prev[`task${currentTask}` as keyof Pick<WritingSession, 'task1' | 'task2'>],
            timeSpent: prev[`task${currentTask}` as keyof Pick<WritingSession, 'task1' | 'task2'>].timeSpent + 1
          }
        }));
      }, 1000);
    } else if (!isActive) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, session.isStarted, session.isCompleted, currentTask]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTest = () => {
    setSession(prev => ({ ...prev, isStarted: true }));
    setIsActive(true);
    setTimer(0);
  };

  const completeTask = (taskNumber: 1 | 2, content: string, wordCount: number) => {
    setSession(prev => ({
      ...prev,
      [`task${taskNumber}`]: {
        ...prev[`task${taskNumber}` as keyof Pick<WritingSession, 'task1' | 'task2'>],
        content,
        wordCount,
        completed: true
      }
    }));

    // Show feedback for the completed task
    setFeedbackData({
      content,
      taskType: taskNumber === 1 ? 'Academic Task 1' : 'Academic Task 2',
      wordCount
    });
    setShowFeedback(true);
  };

  const handleFeedbackClose = () => {
    setShowFeedback(false);
    setFeedbackData(null);
  };

  const handleFeedbackRetry = () => {
    setShowFeedback(false);
    setFeedbackData(null);
    
    // Reset current task
    const taskKey = currentTask === 1 ? 'task1' : 'task2';
    setSession(prev => ({
      ...prev,
      [taskKey]: {
        content: '',
        wordCount: 0,
        timeSpent: prev[taskKey].timeSpent, // Keep the time spent
        completed: false
      }
    }));
  };

  const switchTask = (taskNumber: 1 | 2) => {
    setCurrentTask(taskNumber);
  };

  const submitTest = () => {
    setSession(prev => ({ ...prev, isCompleted: true }));
    setIsActive(false);
    // Here you would typically submit to backend
    console.log('Test submitted:', session);
  };

  const task1Prompt = {
    title: "IELTS Writing Task 1",
    timeAllowed: 20,
    minWords: 150,
    description: "You should spend about 20 minutes on this task.",
    prompt: `The chart below shows the number of international visitors to three different areas in a European country between 1987 and 2007.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`,
    type: "Academic Task 1" as const
  };

  const task2Prompt = {
    title: "IELTS Writing Task 2",
    timeAllowed: 40,
    minWords: 250,
    description: "You should spend about 40 minutes on this task.",
    prompt: `Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake, regardless of whether the course is useful to an employer.

What, in your opinion, are the main functions of a university?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`,
    type: "Academic Task 2" as const
  };

  if (!session.isStarted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              IELTS Writing Test
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Complete both writing tasks within 60 minutes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-500" />
                  Task 1 - Academic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Time Allocation:</span>
                    <span className="font-medium">20 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum Words:</span>
                    <span className="font-medium">150 words</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Task Type:</span>
                    <span className="font-medium">Data Description</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-purple-500" />
                  Task 2 - Essay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Time Allocation:</span>
                    <span className="font-medium">40 minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum Words:</span>
                    <span className="font-medium">250 words</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Task Type:</span>
                    <span className="font-medium">Argumentative Essay</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>You have 60 minutes to complete both tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Task 2 carries more weight in scoring, so allocate time accordingly</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>You can switch between tasks at any time</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Write clearly and organize your ideas logically</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>Check your work for grammar and spelling errors</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {!user && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 mb-8">
              <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Sign in to save your progress and receive detailed feedback
              </p>
            </div>
          )}

          <div className="text-center">
            <Button 
              onClick={startTest}
              size="lg"
              className="px-8 py-4 text-lg"
            >
              <Clock className="w-5 h-5 mr-2" />
              Start Writing Test
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (session.isCompleted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="mb-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Writing Test Completed!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Total time: {formatTime(session.totalTime)}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Task 1 Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Word Count:</span>
                    <span className={`font-medium ${session.task1.wordCount >= 150 ? 'text-green-600' : 'text-red-600'}`}>
                      {session.task1.wordCount} words
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Spent:</span>
                    <span className="font-medium">{formatTime(session.task1.timeSpent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-medium ${session.task1.completed ? 'text-green-600' : 'text-yellow-600'}`}>
                      {session.task1.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Task 2 Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Word Count:</span>
                    <span className={`font-medium ${session.task2.wordCount >= 250 ? 'text-green-600' : 'text-red-600'}`}>
                      {session.task2.wordCount} words
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Spent:</span>
                    <span className="font-medium">{formatTime(session.task2.timeSpent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-medium ${session.task2.completed ? 'text-green-600' : 'text-yellow-600'}`}>
                      {session.task2.completed ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              size="lg"
            >
              Take Another Test
            </Button>
            <Button 
              onClick={() => window.location.href = '/practice-tests'}
              size="lg"
            >
              Back to Practice Tests
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4">
        {/* Header with timer and task switcher */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-purple-500" />
                <span className="text-lg font-mono font-medium">
                  {formatTime(timer)}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total: 60:00
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={currentTask === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => switchTask(1)}
                className="relative"
              >
                Task 1
                {session.task1.completed && (
                  <CheckCircle className="w-4 h-4 ml-1 text-green-500" />
                )}
              </Button>
              <Button
                variant={currentTask === 2 ? "default" : "outline"}
                size="sm"
                onClick={() => switchTask(2)}
                className="relative"
              >
                Task 2
                {session.task2.completed && (
                  <CheckCircle className="w-4 h-4 ml-1 text-green-500" />
                )}
              </Button>
            </div>

            <Button 
              onClick={submitTest}
              variant="destructive"
              size="sm"
            >
              Submit Test
            </Button>
          </div>
        </div>

        {/* Writing Task Component */}
        <WritingTask
          key={currentTask}
          task={currentTask === 1 ? task1Prompt : task2Prompt}
          initialContent={session[`task${currentTask}` as keyof Pick<WritingSession, 'task1' | 'task2'>].content}
          onComplete={(content, wordCount) => completeTask(currentTask, content, wordCount)}
          timeRemaining={currentTask === 1 ? Math.max(0, 1200 - session.task1.timeSpent) : Math.max(0, 2400 - session.task2.timeSpent)}
        />
      </div>

      {/* Writing Feedback Modal */}
      {showFeedback && feedbackData && (
        <WritingFeedback
          content={feedbackData.content}
          taskType={feedbackData.taskType}
          wordCount={feedbackData.wordCount}
          onClose={handleFeedbackClose}
          onRetry={handleFeedbackRetry}
        />
      )}
    </div>
  );
};

export default WritingTestPage;