import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  RotateCcw, 
  Trophy, 
  Clock, 
  Target,
  Star,
  Play,
  Pause,
  Home
} from 'lucide-react';

interface VocabularyCard {
  id: string;
  word: string;
  definition: string;
  type: 'word' | 'definition';
  matchId: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameStats {
  moves: number;
  matches: number;
  timeElapsed: number;
  score: number;
}

interface MatchingCardsGameProps {
  onBack: () => void;
}

const MatchingCardsGame: React.FC<MatchingCardsGameProps> = ({ onBack }) => {
  const [cards, setCards] = useState<VocabularyCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    moves: 0,
    matches: 0,
    timeElapsed: 0,
    score: 0
  });
  const [isGameActive, setIsGameActive] = useState(false);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  const vocabularyPairs: { [key: string]: { word: string; definition: string }[] } = {
    easy: [
      { word: 'dog', definition: 'A domesticated canine' },
      { word: 'cat', definition: 'A domesticated feline' },
      { word: 'apple', definition: 'A common fruit' },
      { word: 'book', definition: 'Pages bound together for reading' },
      { word: 'car', definition: 'A vehicle with four wheels' },
      { word: 'sun', definition: 'The star at the center of our solar system' }
    ],
    medium: [
      { word: 'bicycle', definition: 'A vehicle powered by pedals' },
      { word: 'computer', definition: 'An electronic device for processing data' },
      { word: 'mountain', definition: 'A very high hill' },
      { word: 'ocean', definition: 'A large body of salt water' },
      { word: 'teacher', definition: 'One who educates students' },
      { word: 'library', definition: 'A place full of books' },
      { word: 'airplane', definition: 'A flying vehicle with wings' },
      { word: 'guitar', definition: 'A stringed musical instrument' }
    ],
    hard: [
      { word: 'meticulous', definition: 'Showing great attention to detail' },
      { word: 'unprecedented', definition: 'Never done or known before' },
      { word: 'proliferate', definition: 'Increase rapidly in number' },
      { word: 'ubiquitous', definition: 'Present everywhere' },
      { word: 'ameliorate', definition: 'To make something better' },
      { word: 'paradigm', definition: 'A typical example or model' },
      { word: 'equanimity', definition: 'Mental calmness and composure' },
      { word: 'fastidious', definition: 'Very attentive to detail' },
      { word: 'belligerent', definition: 'Hostile and aggressive' },
      { word: 'circumspect', definition: 'Wary and unwilling to take risks' }
    ]
  };

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isGameActive && !isPaused && !isGameComplete) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
        setGameStats(prev => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    } else if (!isGameActive || isPaused) {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameActive, isPaused, isGameComplete]);

  // Initialize game
  const initializeGame = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    const pairs = vocabularyPairs[selectedDifficulty];
    const gameCards: VocabularyCard[] = [];
    
    pairs.forEach((pair, index) => {
      const matchId = `match-${index}`;
      gameCards.push({
        id: `word-${index}`,
        word: pair.word,
        definition: pair.definition,
        type: 'word',
        matchId,
        isFlipped: false,
        isMatched: false
      });
      gameCards.push({
        id: `def-${index}`,
        word: pair.word,
        definition: pair.definition,
        type: 'definition',
        matchId,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    
    setCards(shuffledCards);
    setFlippedCards([]);
    setGameStats({ moves: 0, matches: 0, timeElapsed: 0, score: 0 });
    setIsGameActive(true);
    setIsGameComplete(false);
    setIsPaused(false);
    setTimer(0);
    setDifficulty(selectedDifficulty);
  };

  // Handle card click
  const handleCardClick = (cardId: string) => {
    if (isPaused || isGameComplete) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;
    
    if (flippedCards.length === 0) {
      // First card flipped
      setFlippedCards([cardId]);
      setCards(prev => prev.map(c => 
        c.id === cardId ? { ...c, isFlipped: true } : c
      ));
    } else if (flippedCards.length === 1) {
      // Second card flipped
      setFlippedCards(prev => [...prev, cardId]);
      setCards(prev => prev.map(c => 
        c.id === cardId ? { ...c, isFlipped: true } : c
      ));
      
      // Check for match
      const firstCard = cards.find(c => c.id === flippedCards[0]);
      const secondCard = card;
      
      if (firstCard && secondCard.matchId === firstCard.matchId) {
        // Match found!
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.matchId === firstCard.matchId ? { ...c, isMatched: true } : c
          ));
          setFlippedCards([]);
          
          const newMatches = gameStats.matches + 1;
          const newMoves = gameStats.moves + 1;
          const totalPairs = vocabularyPairs[difficulty].length;
          
          if (newMatches === totalPairs) {
            // Game complete!
            const finalScore = Math.max(0, 1000 - (newMoves * 10) - (timer * 2));
            setGameStats(prev => ({ 
              ...prev, 
              moves: newMoves, 
              matches: newMatches,
              score: finalScore
            }));
            setIsGameComplete(true);
            setIsGameActive(false);
          } else {
            setGameStats(prev => ({ ...prev, moves: newMoves, matches: newMatches }));
          }
        }, 1000);
      } else {
        // No match - flip cards back
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            flippedCards.includes(c.id) || c.id === cardId ? { ...c, isFlipped: false } : c
          ));
          setFlippedCards([]);
          setGameStats(prev => ({ ...prev, moves: prev.moves + 1 }));
        }, 1500);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetGame = () => {
    initializeGame(difficulty);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Game setup screen
  if (!isGameActive && !isGameComplete && cards.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Matching Cards Game
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Flip cards to match vocabulary words with their definitions. Test your memory and learn new words!
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {(['easy', 'medium', 'hard'] as const).map((level) => (
            <Card 
              key={level}
              className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => initializeGame(level)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  level === 'easy' ? 'bg-green-100 dark:bg-green-900/20' :
                  level === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                  'bg-red-100 dark:bg-red-900/20'
                }`}>
                  <Star className={`w-6 h-6 ${
                    level === 'easy' ? 'text-green-600 dark:text-green-400' :
                    level === 'medium' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`} />
                </div>
                <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 capitalize">
                  {level}
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {level === 'easy' && '6 pairs • Basic vocabulary'}
                  {level === 'medium' && '8 pairs • Intermediate words'}
                  {level === 'hard' && '10 pairs • Advanced vocabulary'}
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
          Congratulations! 🎉
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          You've successfully matched all vocabulary pairs!
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {gameStats.score}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {gameStats.moves}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Moves</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatTime(gameStats.timeElapsed)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {gameStats.matches}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Matches</div>
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
    <div className="max-w-6xl mx-auto">
      {/* Game Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="capitalize">
            {difficulty} Level
          </Badge>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>{formatTime(timer)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-purple-500" />
              <span>Moves: {gameStats.moves}</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span>Matches: {gameStats.matches}/{vocabularyPairs[difficulty].length}</span>
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

      {/* Game Board */}
      <div className={`grid gap-4 ${
        difficulty === 'easy' ? 'grid-cols-3 md:grid-cols-4' :
        difficulty === 'medium' ? 'grid-cols-4 md:grid-cols-4' :
        'grid-cols-4 md:grid-cols-5'
      }`}>
        {cards.map((card) => (
          <motion.div
            key={card.id}
            layoutId={card.id}
            className="aspect-square"
          >
            <div
              className="relative w-full h-full cursor-pointer"
              onClick={() => handleCardClick(card.id)}
            >
              <motion.div
                className="absolute inset-0 w-full h-full"
                initial={false}
                animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Card Back */}
                <div 
                  className="absolute inset-0 w-full h-full backface-hidden"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <Card className="h-full bg-gradient-to-br from-purple-500 to-pink-500 border-0">
                    <CardContent className="h-full flex items-center justify-center p-2">
                      <div className="text-white text-center">
                        <Target className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-xs font-medium">IELTS</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Card Front */}
                <div 
                  className="absolute inset-0 w-full h-full backface-hidden"
                  style={{ 
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)'
                  }}
                >
                  <Card className={`h-full transition-all duration-300 ${
                    card.isMatched 
                      ? 'bg-green-100 dark:bg-green-900/20 border-green-500' 
                      : 'bg-white dark:bg-gray-800 hover:shadow-md'
                  }`}>
                    <CardContent className="h-full flex items-center justify-center p-3">
                      <div className="text-center">
                        {card.type === 'word' ? (
                          <>
                            <div className="text-lg font-bold text-purple-600 dark:text-purple-400 mb-1">
                              {card.word}
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              Word
                            </Badge>
                          </>
                        ) : (
                          <>
                            <div className="text-sm text-gray-700 dark:text-gray-300 leading-tight mb-1">
                              {card.definition}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Definition
                            </Badge>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Game Instructions */}
      <Card className="mt-8">
        <CardContent className="p-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>
              <strong>How to play:</strong> Click on cards to flip them and find matching word-definition pairs. 
              Try to complete the game with the fewest moves and fastest time!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MatchingCardsGame;