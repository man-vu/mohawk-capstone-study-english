import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Brain, 
  Clock, 
  Target,
  CheckCircle,
  XCircle,
  Star,
  Play,
  Pause,
  Home,
  RotateCcw,
  Trophy,
  Lightbulb,
  Zap
} from 'lucide-react';

interface WordGroup {
  id: string;
  theme: string;
  words: string[];
  description: string;
}

interface GameRound {
  id: string;
  targetWord: string;
  relatedWords: string[];
  distractors: string[];
  allOptions: string[];
  theme: string;
}

interface WordAssociationGameProps {
  onBack: () => void;
}

const WordAssociationGame: React.FC<WordAssociationGameProps> = ({ onBack }) => {
  const [currentRound, setCurrentRound] = useState<GameRound | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [totalRounds] = useState(8);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStats, setGameStats] = useState({
    correctAnswers: 0,
    totalTime: 0,
    accuracy: 0
  });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const [wordGroups, setWordGroups] = useState<WordGroup[]>([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    fetch(`${API_URL}/api/vocabulary/groups`)
      .then(res => res.json())
      .then(data => {
        if (data.response) {
          setWordGroups(data.response);
        }
      })
      .catch(() => {});
  }, [API_URL]);

  // Distractor words (unrelated to any theme)
  const distractorWords = [
    'elephant', 'purple', 'sandwich', 'telescope', 'umbrella', 'volcano', 'crystal', 'hurricane',
    'butterfly', 'guitar', 'lighthouse', 'rainbow', 'diamond', 'ocean', 'mountain', 'sunset',
    'library', 'carpet', 'fountain', 'mirror', 'candle', 'window', 'garden', 'bridge'
  ];

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isGameActive && !isPaused && !isGameComplete && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
        setGameStats(prev => ({ ...prev, totalTime: prev.totalTime + 1 }));
      }, 1000);
    } else if (!isGameActive || isPaused) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameActive, isPaused, isGameComplete, timeLeft]);

  // Generate a new round
  const generateRound = () => {
    const randomGroup = wordGroups[Math.floor(Math.random() * wordGroups.length)];
    const targetWord = randomGroup.words[Math.floor(Math.random() * randomGroup.words.length)];
    
    // Select related words (excluding target word)
    const relatedWords = randomGroup.words
      .filter(word => word !== targetWord)
      .sort(() => Math.random() - 0.5)
      .slice(0, difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5);

    // Select distractor words
    const numDistractors = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    const selectedDistractors = distractorWords
      .sort(() => Math.random() - 0.5)
      .slice(0, numDistractors);

    // Combine and shuffle all options
    const allOptions = [...relatedWords, ...selectedDistractors].sort(() => Math.random() - 0.5);

    const newRound: GameRound = {
      id: `round-${roundNumber}`,
      targetWord,
      relatedWords,
      distractors: selectedDistractors,
      allOptions,
      theme: randomGroup.theme
    };

    setCurrentRound(newRound);
    setSelectedWords([]);
    setFeedback(null);
    setTimeLeft(difficulty === 'easy' ? 45 : difficulty === 'medium' ? 30 : 20);
  };

  // Start game
  const startGame = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    setIsGameActive(true);
    setIsGameComplete(false);
    setRoundNumber(1);
    setScore(0);
    setGameStats({ correctAnswers: 0, totalTime: 0, accuracy: 0 });
    generateRound();
  };

  // Handle word selection
  const handleWordSelect = (word: string) => {
    if (isPaused || !currentRound) return;
    
    if (selectedWords.includes(word)) {
      setSelectedWords(prev => prev.filter(w => w !== word));
    } else {
      setSelectedWords(prev => [...prev, word]);
    }
  };

  // Submit answer
  const submitAnswer = () => {
    if (!currentRound) return;

    const correctCount = selectedWords.filter(word => 
      currentRound.relatedWords.includes(word)
    ).length;
    
    const incorrectCount = selectedWords.filter(word => 
      currentRound.distractors.includes(word)
    ).length;

    const roundScore = Math.max(0, (correctCount * 10) - (incorrectCount * 5));
    const timeBonus = Math.floor(timeLeft / 2);
    const totalRoundScore = roundScore + timeBonus;

    setScore(prev => prev + totalRoundScore);
    
    if (correctCount === currentRound.relatedWords.length && incorrectCount === 0) {
      setFeedback(`Perfect! +${totalRoundScore} points`);
      setGameStats(prev => ({ ...prev, correctAnswers: prev.correctAnswers + 1 }));
    } else if (correctCount > incorrectCount) {
      setFeedback(`Good job! +${totalRoundScore} points`);
    } else {
      setFeedback(`Try harder next time. +${totalRoundScore} points`);
    }

    setTimeout(() => {
      if (roundNumber >= totalRounds) {
        completeGame();
      } else {
        setRoundNumber(prev => prev + 1);
        generateRound();
      }
    }, 2000);
  };

  // Handle time up
  const handleTimeUp = () => {
    if (!currentRound) return;
    
    setFeedback('Time\'s up!');
    setTimeout(() => {
      if (roundNumber >= totalRounds) {
        completeGame();
      } else {
        setRoundNumber(prev => prev + 1);
        generateRound();
      }
    }, 2000);
  };

  // Complete game
  const completeGame = () => {
    const accuracy = (gameStats.correctAnswers / totalRounds) * 100;
    setGameStats(prev => ({ ...prev, accuracy }));
    setIsGameComplete(true);
    setIsGameActive(false);
  };

  // Reset game
  const resetGame = () => {
    setCurrentRound(null);
    setSelectedWords([]);
    setScore(0);
    setRoundNumber(1);
    setTimeLeft(30);
    setIsGameActive(false);
    setIsGameComplete(false);
    setIsPaused(false);
    setGameStats({ correctAnswers: 0, totalTime: 0, accuracy: 0 });
    setFeedback(null);
  };

  // Toggle pause
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Game setup screen
  if (!isGameActive && !isGameComplete) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Word Association Game
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Find words related to the target word. Test your vocabulary knowledge and word connections!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {(['easy', 'medium', 'hard'] as const).map((level) => (
            <Card 
              key={level}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => startGame(level)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  level === 'easy' ? 'bg-green-100 dark:bg-green-900/20' :
                  level === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                  'bg-red-100 dark:bg-red-900/20'
                }`}>
                  <Brain className={`w-6 h-6 ${
                    level === 'easy' ? 'text-green-600 dark:text-green-400' :
                    level === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`} />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 capitalize">
                  {level}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {level === 'easy' && '45s per round • 7 words to choose from'}
                  {level === 'medium' && '30s per round • 10 words to choose from'}
                  {level === 'hard' && '20s per round • 13 words to choose from'}
                </div>
                <Button className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  Start Game
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" onClick={onBack}>
            <Home className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
        </div>
      </div>
    );
  }

  // Game completion screen
  if (isGameComplete) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Game Complete! 🧠
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You've completed all {totalRounds} rounds of word association!
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {score}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(gameStats.accuracy)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {gameStats.correctAnswers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Perfect Rounds</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {Math.floor(gameStats.totalTime / 60)}:{(gameStats.totalTime % 60).toString().padStart(2, '0')}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time Played</div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4 justify-center">
            <Button onClick={resetGame} size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <Button variant="outline" onClick={onBack} size="lg">
              <Home className="w-4 h-4 mr-2" />
              Back to Games
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Active game screen
  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="capitalize">
            {difficulty} Level
          </Badge>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-500" />
              <span className={timeLeft <= 10 ? 'text-red-500 font-bold' : ''}>{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-purple-500" />
              <span>Round: {roundNumber}/{totalRounds}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Score: {score}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={togglePause} variant="outline" size="sm">
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button onClick={resetGame} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button onClick={onBack} variant="outline" size="sm">
            <Home className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <Progress value={(roundNumber / totalRounds) * 100} className="w-full" />
      </div>

      {/* Pause Overlay */}
      <AnimatePresence>
        {isPaused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <Card>
              <CardContent className="p-8 text-center">
                <Pause className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Game Paused
                </h3>
                <Button onClick={togglePause}>
                  <Play className="w-4 h-4 mr-2" />
                  Resume Game
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {currentRound && (
        <>
          {/* Game Content */}
          <Card className="mb-6">
            <CardHeader>
              <div className="text-center">
                <CardTitle className="text-2xl mb-2">
                  Find words related to:
                </CardTitle>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {currentRound.targetWord.toUpperCase()}
                </div>
                <Badge variant="secondary">
                  Theme: {currentRound.theme}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Select {currentRound.relatedWords.length} related words
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Selected: {selectedWords.length} / {currentRound.relatedWords.length}
                </div>
              </div>

              {/* Word Options */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
                {currentRound.allOptions.map((word, index) => (
                  <motion.div
                    key={word}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      variant={selectedWords.includes(word) ? "default" : "outline"}
                      className={`w-full h-12 text-sm ${
                        selectedWords.includes(word) 
                          ? 'bg-purple-600 hover:bg-purple-700' 
                          : 'hover:bg-purple-50 dark:hover:bg-purple-900/20'
                      }`}
                      onClick={() => handleWordSelect(word)}
                      disabled={isPaused}
                    >
                      {word}
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <Button 
                  onClick={submitAnswer}
                  disabled={selectedWords.length === 0 || isPaused}
                  size="lg"
                  className="px-8"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Submit Answer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feedback */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              >
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="mb-4">
                      {feedback.includes('Perfect') && <Trophy className="w-12 h-12 text-yellow-500 mx-auto" />}
                      {feedback.includes('Good') && <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />}
                      {feedback.includes('Try harder') && <XCircle className="w-12 h-12 text-red-500 mx-auto" />}
                      {feedback.includes('Time\'s up') && <Clock className="w-12 h-12 text-orange-500 mx-auto" />}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {feedback}
                    </h3>
                    {currentRound && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        <p className="mb-2">Correct answers were:</p>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {currentRound.relatedWords.map(word => (
                            <Badge key={word} variant="secondary">
                              {word}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default WordAssociationGame;