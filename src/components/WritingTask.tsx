import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Clock, FileText, AlertCircle, CheckCircle, Target } from 'lucide-react';

interface WritingTaskProps {
  task: {
    title: string;
    timeAllowed: number;
    minWords: number;
    description: string;
    prompt: string;
    type: 'Academic Task 1' | 'Academic Task 2';
  };
  initialContent: string;
  onComplete: (content: string, wordCount: number) => void;
  timeRemaining: number;
}

const WritingTask: React.FC<WritingTaskProps> = ({
  task,
  initialContent,
  onComplete,
  timeRemaining
}) => {
  const [content, setContent] = useState(initialContent);
  const [wordCount, setWordCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Count words function
  const countWords = useCallback((text: string) => {
    if (!text.trim()) return 0;
    return text.trim().split(/\s+/).length;
  }, []);

  // Update word count when content changes
  useEffect(() => {
    const words = countWords(content);
    setWordCount(words);
  }, [content, countWords]);

  // Auto-save content
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== initialContent) {
        // Auto-save logic would go here
        console.log('Auto-saving content...');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [content, initialContent]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleComplete = () => {
    onComplete(content, wordCount);
    setIsCompleted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getWordCountStatus = () => {
    if (wordCount >= task.minWords) {
      return { color: 'text-green-600', icon: CheckCircle, message: 'Word count requirement met' };
    } else if (wordCount >= task.minWords * 0.8) {
      return { color: 'text-yellow-600', icon: AlertCircle, message: `${task.minWords - wordCount} more words needed` };
    } else {
      return { color: 'text-red-600', icon: AlertCircle, message: `${task.minWords - wordCount} more words needed` };
    }
  };

  const wordCountStatus = getWordCountStatus();
  const StatusIcon = wordCountStatus.icon;

  const getTimeStatus = () => {
    const recommendedTime = task.timeAllowed * 60; // Convert to seconds
    const timeUsed = recommendedTime - timeRemaining;
    const timeUsedPercentage = (timeUsed / recommendedTime) * 100;

    if (timeUsedPercentage >= 100) {
      return { color: 'text-red-600', status: 'Over Time' };
    } else if (timeUsedPercentage >= 80) {
      return { color: 'text-yellow-600', status: 'Running Out' };
    } else {
      return { color: 'text-green-600', status: 'On Track' };
    }
  };

  const timeStatus = getTimeStatus();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Task Instructions */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {task.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Time and Word Requirements */}
              <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Clock className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Time</span>
                  </div>
                  <div className={`text-lg font-mono ${timeStatus.color}`}>
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="text-xs text-gray-500">{timeStatus.status}</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Target className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-medium">Words</span>
                  </div>
                  <div className={`text-lg font-medium ${wordCountStatus.color}`}>
                    {wordCount}
                  </div>
                  <div className="text-xs text-gray-500">Min: {task.minWords}</div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className={`flex items-center gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50`}>
                <StatusIcon className={`w-4 h-4 ${wordCountStatus.color}`} />
                <span className={`text-sm ${wordCountStatus.color}`}>
                  {wordCountStatus.message}
                </span>
              </div>

              {/* Task Description */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Instructions</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {task.description}
                </p>
              </div>

              {/* Task Prompt */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Task Prompt</h4>
                <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                  {task.prompt}
                </div>
              </div>

              {/* Task-specific tips */}
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Tips</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {task.type === 'Academic Task 1' ? (
                    <>
                      <li>• Describe the main trends and patterns</li>
                      <li>• Compare and contrast data points</li>
                      <li>• Use specific figures from the chart</li>
                      <li>• Organize information logically</li>
                      <li>• Use appropriate academic vocabulary</li>
                    </>
                  ) : (
                    <>
                      <li>• State your position clearly</li>
                      <li>• Support arguments with examples</li>
                      <li>• Address both sides of the issue</li>
                      <li>• Use connecting words and phrases</li>
                      <li>• Write a strong conclusion</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Complete Task Button */}
              <Button
                onClick={handleComplete}
                disabled={isCompleted || wordCount < task.minWords}
                className="w-full"
                variant={isCompleted ? "outline" : "default"}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Task Completed
                  </>
                ) : (
                  `Complete Task ${task.type.includes('1') ? '1' : '2'}`
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Writing Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Your Response</CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">
                    Auto-save enabled
                  </span>
                  <div className={`flex items-center gap-1 ${wordCountStatus.color}`}>
                    <span className="font-medium">{wordCount} words</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <textarea
                  value={content}
                  onChange={handleContentChange}
                  placeholder={`Start writing your response for ${task.title}...`}
                  className="w-full h-[500px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  disabled={isCompleted}
                />
                
                {/* Writing Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Progress to minimum word count
                    </span>
                    <span className="text-sm font-medium">
                      {Math.min(100, Math.round((wordCount / task.minWords) * 100))}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        wordCount >= task.minWords 
                          ? 'bg-green-500' 
                          : wordCount >= task.minWords * 0.8 
                          ? 'bg-yellow-500' 
                          : 'bg-red-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (wordCount / task.minWords) * 100)}%`
                      }}
                    />
                  </div>
                </div>

                {/* Character count for reference */}
                <div className="mt-2 text-xs text-gray-500 text-right">
                  {content.length} characters
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Writing Tips */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Writing Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-medium mb-2">Structure</h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Clear introduction
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Logical body paragraphs
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Strong conclusion
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Language</h5>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Varied sentence structures
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Academic vocabulary
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      Correct grammar
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default WritingTask;