import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Zap, 
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
  Brain,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Shuffle
} from 'lucide-react';

interface FlashcardData {
  id: string;
  word: string;
  definition: string;
  example: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  memorized: boolean;
  attempts: number;
  correctStreak: number;
}

interface GameSession {
  currentCardIndex: number;
  showAnswer: boolean;
  score: number;
  correctAnswers: number;
  totalAnswers: number;
  timeElapsed: number;
  cardsReviewed: number;
  sessionComplete: boolean;
}

interface FlashcardMemoryGameProps {
  onBack: () => void;
}

const FlashcardMemoryGame: React.FC<FlashcardMemoryGameProps> = ({ onBack }) => {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [gameSession, setGameSession] = useState<GameSession>({
    currentCardIndex: 0,
    showAnswer: false,
    score: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    timeElapsed: 0,
    cardsReviewed: 0,
    sessionComplete: false
  });
  const [isGameActive, setIsGameActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [gameMode, setGameMode] = useState<'study' | 'quiz' | 'memory'>('study');
  const [lexiconType, setLexiconType] =
    useState<'vocabulary' | 'idiom' | 'phrasal verb'>('vocabulary');
  const [timer, setTimer] = useState(0);

  const [sampleFlashcards, setSampleFlashcards] = useState<FlashcardData[]>([]);
  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT;

  useEffect(() => {
  fetch(`${API_URL}lexicon/words?type=${encodeURIComponent(lexiconType)}&limit=100`)
      .then(res => res.json())
      .then(data => {
        if (data.response) {
          const mapped = data.response.map((w: any, idx: number) => ({
            id: String(w.WordId || idx),
            word: w.Word,
            definition: w.Definition,
            example: w.Example || '',
            difficulty: (w.Difficulty || 'medium') as 'easy' | 'medium' | 'hard',
            category: w.Category || 'General',
            memorized: false,
            attempts: 0,
            correctStreak: 0,
          }));
          setSampleFlashcards(mapped);
        }
      })
      .catch(() => {});
  }, [API_URL, lexiconType]);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isGameActive && !isPaused && !gameSession.sessionComplete) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
        setGameSession(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    } else if (!isGameActive || isPaused) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameActive, isPaused, gameSession.sessionComplete]);

  // Initialize game
  const initializeGame = (difficulty: 'easy' | 'medium' | 'hard' | 'mixed', mode: 'study' | 'quiz' | 'memory') => {
    let filteredCards = [...sampleFlashcards];
    
    if (difficulty !== 'mixed') {
      filteredCards = sampleFlashcards.filter(card => card.difficulty === difficulty);
    }
    
    // Shuffle cards
    filteredCards = filteredCards.sort(() => Math.random() - 0.5);
    
    setFlashcards(filteredCards);
    setSelectedDifficulty(difficulty);
    setGameMode(mode);
    setGameSession({
      currentCardIndex: 0,
      showAnswer: false,
      score: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      timeElapsed: 0,
      cardsReviewed: 0,
      sessionComplete: false
    });
    setIsGameActive(true);
    setIsPaused(false);
    setTimer(0);
  };

  // Handle card navigation
  const nextCard = () => {
    if (gameSession.currentCardIndex < flashcards.length - 1) {
      setGameSession(prev => ({
        ...prev,
        currentCardIndex: prev.currentCardIndex + 1,
        showAnswer: false,
        cardsReviewed: prev.cardsReviewed + 1
      }));
    } else {
      // Session complete
      setGameSession(prev => ({ ...prev, sessionComplete: true }));
      setIsGameActive(false);
    }
  };

  const previousCard = () => {
    if (gameSession.currentCardIndex > 0) {
      setGameSession(prev => ({
        ...prev,
        currentCardIndex: prev.currentCardIndex - 1,
        showAnswer: false
      }));
    }
  };

  // Handle answer feedback
  const handleAnswerFeedback = (isCorrect: boolean) => {
    const currentCard = flashcards[gameSession.currentCardIndex];
    
    // Update card statistics
    setFlashcards(prev => prev.map(card => {
      if (card.id === currentCard.id) {
        return {
          ...card,
          attempts: card.attempts + 1,
          correctStreak: isCorrect ? card.correctStreak + 1 : 0,
          memorized: isCorrect && card.correctStreak >= 2
        };
      }
      return card;
    }));

    // Update session statistics
    setGameSession(prev => ({
      ...prev,
      totalAnswers: prev.totalAnswers + 1,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      score: isCorrect ? prev.score + 10 : prev.score
    }));

    // Auto-advance after feedback
    setTimeout(() => {
      nextCard();
    }, 1500);
  };

  // Toggle answer visibility
  const toggleAnswer = () => {
    setGameSession(prev => ({ ...prev, showAnswer: !prev.showAnswer }));
  };

  // Shuffle cards
  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setGameSession(prev => ({ ...prev, currentCardIndex: 0, showAnswer: false }));
  };

  // Reset game
  const resetGame = () => {
    setFlashcards([]);
    setGameSession({
      currentCardIndex: 0,
      showAnswer: false,
      score: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      timeElapsed: 0,
      cardsReviewed: 0,
      sessionComplete: false
    });
    setIsGameActive(false);
    setIsPaused(false);
    setTimer(0);
  };

  // Toggle pause
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Keyboard controls
  useEffect(() => {
    const preventSpaceScroll = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isGameActive && !isPaused && !gameSession.sessionComplete) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isGameActive || isPaused || gameSession.sessionComplete) return;

      switch (e.key) {
        case 'ArrowRight':
          if (gameSession.showAnswer || gameMode !== 'study') {
            nextCard();
          } else {
            toggleAnswer();
          }
          break;
        case 'ArrowLeft':
          previousCard();
          break;
        case ' ':
          e.preventDefault();
          toggleAnswer();
          break;
        case 'e':
        case 'E':
          if (gameMode === 'quiz' && gameSession.showAnswer) handleAnswerFeedback(true);
          break;
        case 'd':
        case 'D':
          if (gameMode === 'quiz' && gameSession.showAnswer) handleAnswerFeedback(false);
          break;
        default:
          break;
      }
    };
    window.addEventListener('keydown', preventSpaceScroll, { passive: false });
    window.addEventListener('keyup', preventSpaceScroll, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', preventSpaceScroll);
      window.removeEventListener('keyup', preventSpaceScroll);
    };
  }, [isGameActive, isPaused, gameSession, gameMode]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Game setup screen
  if (!isGameActive && !gameSession.sessionComplete) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Flashcard Memory Game
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Master vocabulary, idioms, or phrasal verbs through interactive flashcards with spaced repetition and memory challenges
          </p>
        </div>

        {/* Word Type Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Choose Word Type
          </h3>
          <div className="flex justify-center gap-2">
            {[
              { id: 'vocabulary', label: 'Vocabulary' },
              { id: 'idiom', label: 'Idioms' },
              { id: 'phrasal verb', label: 'Phrasal Verbs' }
            ].map(t => (
              <Button
                key={t.id}
                variant={lexiconType === t.id ? 'default' : 'outline'}
                onClick={() => setLexiconType(t.id as any)}
              >
                {t.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Game Mode Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Choose Game Mode
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {([
              { mode: 'study', icon: Brain, title: 'Study Mode', desc: 'Review flashcards at your own pace' },
              { mode: 'quiz', icon: Target, title: 'Quiz Mode', desc: 'Test your knowledge with immediate feedback' },
              { mode: 'memory', icon: Zap, title: 'Memory Challenge', desc: 'Rapid-fire memory training' }
            ] as const).map(({ mode, icon: Icon, title, desc }) => (
              <Card 
                key={mode}
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                  gameMode === mode ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setGameMode(mode)}
              >
                <CardContent className="p-6 text-center">
                  <Icon className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Choose Difficulty
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {([
              { level: 'easy', color: 'green', desc: '4 easy words' },
              { level: 'medium', color: 'yellow', desc: '4 medium words' },
              { level: 'hard', color: 'red', desc: '2 hard words' },
              { level: 'mixed', color: 'purple', desc: 'All 10 words' }
            ] as const).map(({ level, color, desc }) => (
              <Card 
                key={level}
                className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${
                  selectedDifficulty === level ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => setSelectedDifficulty(level)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                    color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                    color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                    color === 'red' ? 'bg-red-100 dark:bg-red-900/20' :
                    'bg-purple-100 dark:bg-purple-900/20'
                  }`}>
                    <Star className={`w-4 h-4 ${
                      color === 'green' ? 'text-green-600 dark:text-green-400' :
                      color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                      color === 'red' ? 'text-red-600 dark:text-red-400' :
                      'text-purple-600 dark:text-purple-400'
                    }`} />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1 capitalize">
                    {level}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center space-y-4">
          <Button 
            onClick={() => initializeGame(selectedDifficulty, gameMode)}
            size="lg"
            className="px-8"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Flashcard Game
          </Button>
          <Button variant="outline" onClick={onBack}>
            <Home className="w-4 h-4 mr-2" />
            Back to Games
          </Button>
        </div>
      </div>
    );
  }

  // Game completion screen
  if (gameSession.sessionComplete) {
    const accuracy = gameSession.totalAnswers > 0 ? (gameSession.correctAnswers / gameSession.totalAnswers) * 100 : 0;
    const memorizedCount = flashcards.filter(card => card.memorized).length;

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
          Session Complete! ⚡
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You've completed your flashcard study session!
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {gameSession.score}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {Math.round(accuracy)}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {memorizedCount}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Memorized</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {formatTime(gameSession.timeElapsed)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
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
  const currentCard = flashcards[gameSession.currentCardIndex];
  if (!currentCard) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="capitalize">
            {gameMode} Mode
          </Badge>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>{formatTime(timer)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-purple-500" />
              <span>Card: {gameSession.currentCardIndex + 1}/{flashcards.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span>Score: {gameSession.score}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={togglePause} variant="outline" size="sm">
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </Button>
          <Button onClick={shuffleCards} variant="outline" size="sm">
            <Shuffle className="w-4 h-4" />
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
        <Progress value={((gameSession.currentCardIndex + 1) / flashcards.length) * 100} className="w-full" />
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

      {/* Main Flashcard */}
      <div className="mb-6">
        <motion.div
          key={currentCard.id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="min-h-[400px]">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {currentCard.category}
                  </Badge>
                  <div className="flex items-center gap-2">
                    <Badge className={`${
                      currentCard.difficulty === 'easy' ? 'bg-green-500' :
                      currentCard.difficulty === 'medium' ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}>
                      {currentCard.difficulty}
                    </Badge>
                    {currentCard.memorized && (
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Memorized
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                  <div>Attempts: {currentCard.attempts}</div>
                  <div>Streak: {currentCard.correctStreak}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                  {currentCard.word}
                </h3>
                
                <AnimatePresence mode="wait">
                  {gameSession.showAnswer ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-lg text-gray-800 dark:text-gray-200 mb-3">
                          {currentCard.definition}
                        </p>
                        <p className="text-sm italic text-gray-600 dark:text-gray-400">
                          "{currentCard.example}"
                        </p>
                      </div>
                      
                      {gameMode === 'quiz' && (
                        <div className="flex gap-4 justify-center">
                          <Button 
                            onClick={() => handleAnswerFeedback(false)}
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Difficult
                          </Button>
                          <Button 
                            onClick={() => handleAnswerFeedback(true)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Easy
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center"
                    >
                      <div className="text-gray-400 dark:text-gray-600 mb-4">
                        <Eye className="w-16 h-16 mx-auto" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Think about the definition, then reveal the answer
                      </p>
                      <Button onClick={toggleAnswer} size="lg">
                        <EyeOff className="w-4 h-4 mr-2" />
                        Show Definition
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center">
        <Button 
          onClick={previousCard} 
          variant="outline"
          disabled={gameSession.currentCardIndex === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <div className="flex gap-2">
          {gameMode === 'study' && gameSession.showAnswer && (
            <Button onClick={nextCard}>
              Next Card
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
          {!gameSession.showAnswer && (
            <Button onClick={toggleAnswer} variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Show Answer
            </Button>
          )}
        </div>
        
        <Button 
          onClick={nextCard} 
          variant="outline"
          disabled={gameSession.currentCardIndex === flashcards.length - 1}
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Statistics */}
      <Card className="mt-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {gameSession.correctAnswers}/{gameSession.totalAnswers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {flashcards.filter(card => card.memorized).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Memorized</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {gameSession.cardsReviewed}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Reviewed</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {gameSession.totalAnswers > 0 ? Math.round((gameSession.correctAnswers / gameSession.totalAnswers) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FlashcardMemoryGame;