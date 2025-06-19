import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  Clock, 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic, 
  Play, 
  Pause, 
  SkipForward,
  CheckCircle,
  AlertCircle,
  Timer,
  Users,
  Trophy,
  Target
} from 'lucide-react';

interface MockTestSection {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  duration: number; // in minutes
  totalQuestions: number;
  completed: boolean;
  score?: number;
  timeSpent: number;
  status: 'not-started' | 'in-progress' | 'completed' | 'current';
}

interface MockTestSession {
  id: string;
  title: string;
  description: string;
  totalDuration: number; // in minutes
  sections: MockTestSection[];
  currentSection: number;
  isStarted: boolean;
  isCompleted: boolean;
  isPaused: boolean;
  startTime?: Date;
  endTime?: Date;
  overallScore?: number;
}

const FullMockTestsPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedTest, setSelectedTest] = useState<MockTestSession | null>(null);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const [mockTests, setMockTests] = useState<MockTestSession[]>([]);
  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT;

  useEffect(() => {
    fetch(`${API_URL}mock-tests`)
      .then(res => res.json())
      .then(data => {
        if (data.response) {
          const tests = data.response.map((t: any) => ({
            id: String(t.MockTestId),
            title: t.Title,
            description: t.Description,
            totalDuration: t.TotalDuration,
            currentSection: 0,
            isStarted: false,
            isCompleted: false,
            isPaused: false,
            sections: t.MockTestSection.map((s: any) => ({
              id: String(s.SectionId),
              name: s.Quiz ? s.Quiz.Title : 'Section',
              icon: s.SkillId === 1 ? Headphones : s.SkillId === 2 ? BookOpen : s.SkillId === 3 ? PenTool : Mic,
              duration: s.Duration,
              totalQuestions: s.TotalQuestions,
              completed: false,
              timeSpent: 0,
              status: 'not-started' as const,
            }))
          }));
          setMockTests(tests);
        }
      })
      .catch(() => {});
  }, [API_URL]);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && selectedTest && !selectedTest.isCompleted) {
      interval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 1000);
    } else if (!isActive) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, selectedTest]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTest = (test: MockTestSession) => {
    const updatedTest = {
      ...test,
      isStarted: true,
      startTime: new Date(),
      sections: test.sections.map((section, index) => ({
        ...section,
        status: index === 0 ? 'current' as const : 'not-started' as const
      }))
    };
    setSelectedTest(updatedTest);
    setIsActive(true);
    setTimer(0);
  };

  const pauseTest = () => {
    if (selectedTest) {
      setSelectedTest({ ...selectedTest, isPaused: !selectedTest.isPaused });
      setIsActive(!selectedTest.isPaused);
    }
  };

  const nextSection = () => {
    if (selectedTest && selectedTest.currentSection < selectedTest.sections.length - 1) {
      const nextSectionIndex = selectedTest.currentSection + 1;
      const updatedSections = selectedTest.sections.map((section, index) => ({
        ...section,
        status: index === selectedTest.currentSection ? 'completed' as const :
                index === nextSectionIndex ? 'current' as const :
                section.status
      }));

      setSelectedTest({
        ...selectedTest,
        currentSection: nextSectionIndex,
        sections: updatedSections
      });
    }
  };

  const completeTest = () => {
    if (selectedTest) {
      const completedTest = {
        ...selectedTest,
        isCompleted: true,
        endTime: new Date(),
        sections: selectedTest.sections.map(section => ({
          ...section,
          status: 'completed' as const,
          completed: true
        })),
        overallScore: Math.floor(Math.random() * 3) + 6 // Mock score between 6-9
      };
      setSelectedTest(completedTest);
      setIsActive(false);
    }
  };

  const getProgressPercentage = () => {
    if (!selectedTest) return 0;
    const completedSections = selectedTest.sections.filter(s => s.completed).length;
    const currentProgress = selectedTest.sections[selectedTest.currentSection]?.status === 'current' ? 0.5 : 0;
    return ((completedSections + currentProgress) / selectedTest.sections.length) * 100;
  };

  const getSectionColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'current': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'in-progress': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  // Test selection view
  if (!selectedTest) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Full IELTS Mock Tests
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Experience complete IELTS tests with all four skills in exam conditions
            </p>
          </div>

          {!user && (
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800 mb-8">
              <p className="text-sm text-purple-700 dark:text-purple-300 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Sign in to save your test results and track your progress over time
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {mockTests.map((test) => (
              <Card key={test.id} className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{test.title}</CardTitle>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {test.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {test.id.includes('academic') ? 'Academic' : 'General Training'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Test Overview */}
                    <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Timer className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium">Duration</span>
                        </div>
                        <div className="text-lg font-medium">
                          {Math.floor(test.totalDuration / 60)}h {test.totalDuration % 60}m
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Target className="w-4 h-4 text-purple-500" />
                          <span className="text-sm font-medium">Sections</span>
                        </div>
                        <div className="text-lg font-medium">4 Skills</div>
                      </div>
                    </div>

                    {/* Sections Preview */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">Test Sections</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {test.sections.map((section) => {
                          const IconComponent = section.icon;
                          return (
                            <div key={section.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded">
                              <IconComponent className="w-4 h-4 text-purple-500" />
                              <div className="flex-1">
                                <div className="text-sm font-medium">{section.name}</div>
                                <div className="text-xs text-gray-500">{section.duration}min</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <Button 
                      onClick={() => startTest(test)}
                      className="w-full"
                      size="lg"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Start Full Mock Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Test Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Before You Start</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Find a quiet environment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Prepare headphones for listening</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Have pen and paper ready</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Ensure stable internet connection</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Test Format</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Complete all sections in sequence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Strict timing for each section</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>No breaks between sections</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Instant results and feedback</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Test completion view
  if (selectedTest.isCompleted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="mb-8">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Mock Test Completed!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Total time: {formatTime(timer)}
            </p>
          </div>

          {selectedTest.overallScore && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Overall Band Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {selectedTest.overallScore}.0
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {selectedTest.overallScore >= 8 ? 'Excellent' : 
                   selectedTest.overallScore >= 7 ? 'Very Good' :
                   selectedTest.overallScore >= 6 ? 'Good' : 'Needs Improvement'}
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {selectedTest.sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <Card key={section.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <IconComponent className="w-5 h-5" />
                      {section.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Time Spent:</span>
                        <span className="font-medium">{formatTime(section.timeSpent)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Questions:</span>
                        <span className="font-medium">{section.totalQuestions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Score:</span>
                        <span className="font-medium text-green-600">
                          {section.score || Math.floor(Math.random() * 3) + 6}.0
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => setSelectedTest(null)}
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

  // Active test view
  const currentSection = selectedTest.sections[selectedTest.currentSection];
  const IconComponent = currentSection.icon;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4">
        {/* Test Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {selectedTest.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Section {selectedTest.currentSection + 1} of {selectedTest.sections.length}: {currentSection.name}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Time</div>
                <div className="text-lg font-mono font-medium">
                  {formatTime(timer)}
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">Section Time</div>
                <div className="text-lg font-mono font-medium">
                  {formatTime(Math.min(timer, currentSection.duration * 60))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={pauseTest}
                  variant="outline"
                  size="sm"
                >
                  {selectedTest.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </Button>
                <Button
                  onClick={nextSection}
                  variant="outline"
                  size="sm"
                  disabled={selectedTest.currentSection >= selectedTest.sections.length - 1}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Button
                  onClick={completeTest}
                  variant="destructive"
                  size="sm"
                >
                  End Test
                </Button>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Test Progress
              </span>
              <span className="text-sm font-medium">
                {Math.round(getProgressPercentage())}%
              </span>
            </div>
            <Progress value={getProgressPercentage()} className="w-full" />
          </div>
        </div>

        {/* Section Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {selectedTest.sections.map((section, index) => {
              const SectionIcon = section.icon;
              return (
                <div
                  key={section.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    index === selectedTest.currentSection
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : section.completed
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <SectionIcon className={`w-4 h-4 ${getSectionColor(section.status).split(' ')[0]}`} />
                    <span className="font-medium text-sm">{section.name}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {section.duration} min • {section.totalQuestions} questions
                  </div>
                  <Badge variant="outline" className={`mt-1 ${getSectionColor(section.status)}`}>
                    {section.status === 'not-started' ? 'Waiting' :
                     section.status === 'current' ? 'Active' :
                     section.status === 'completed' ? 'Done' : section.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Section Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconComponent className="w-6 h-6 text-purple-500" />
              {currentSection.name} Section
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-20">
              <IconComponent className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {currentSection.name} Test Content
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                This is where the actual {currentSection.name.toLowerCase()} test content would be displayed.
                In a real implementation, this would include:
              </p>
              
              {currentSection.id === 'listening' && (
                <div className="text-left max-w-md mx-auto">
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Audio player with test recordings</li>
                    <li>• Multiple choice questions</li>
                    <li>• Form completion tasks</li>
                    <li>• Map/plan labeling exercises</li>
                  </ul>
                </div>
              )}

              {currentSection.id === 'reading' && (
                <div className="text-left max-w-md mx-auto">
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Reading passages</li>
                    <li>• Multiple choice questions</li>
                    <li>• True/False/Not Given tasks</li>
                    <li>• Matching headings exercises</li>
                  </ul>
                </div>
              )}

              {currentSection.id === 'writing' && (
                <div className="text-left max-w-md mx-auto">
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Task 1: Data description (20 min)</li>
                    <li>• Task 2: Essay writing (40 min)</li>
                    <li>• Word count tracking</li>
                    <li>• Real-time feedback</li>
                  </ul>
                </div>
              )}

              {currentSection.id === 'speaking' && (
                <div className="text-left max-w-md mx-auto">
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Part 1: Introduction (4-5 min)</li>
                    <li>• Part 2: Individual long turn (3-4 min)</li>
                    <li>• Part 3: Two-way discussion (4-5 min)</li>
                    <li>• Voice recording capability</li>
                  </ul>
                </div>
              )}

              <div className="mt-8 space-y-4">
                <Button
                  onClick={nextSection}
                  disabled={selectedTest.currentSection >= selectedTest.sections.length - 1}
                  size="lg"
                >
                  {selectedTest.currentSection >= selectedTest.sections.length - 1 ? 'Complete Test' : 'Next Section'}
                  <SkipForward className="w-4 h-4 ml-2" />
                </Button>
                
                <p className="text-xs text-gray-500">
                  This is a demonstration view. In production, each section would have its actual test interface.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FullMockTestsPage;