import React, { useState, useEffect } from 'react';
import { Progress } from '../../ui/progress';
import { Button } from '../../ui/button';
import { Play, Pause, RotateCcw, Home, Shuffle, Trophy, Zap, Target, Brain, Star, Clock } from 'lucide-react';

import StudyMode from './StudyMode';
import QuizMode from './QuizMode';
import MemoryChallenge from './MemoryChallenge';

// Type definitions
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
  initialGameMode?: 'study' | 'quiz' | 'memory';
}

const FlashcardMemoryGame: React.FC<FlashcardMemoryGameProps> = ({
  onBack,
  initialGameMode = 'study',
}) => {
  // State
  const [flashcards, setFlashcards] = useState<FlashcardData[]>([]);
  const [gameSession, setGameSession] = useState<GameSession>({
    currentCardIndex: 0,
    showAnswer: false,
    score: 0,
    correctAnswers: 0,
    totalAnswers: 0,
    timeElapsed: 0,
    cardsReviewed: 0,
    sessionComplete: false,
  });
  const [isGameActive, setIsGameActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard' | 'mixed'>('mixed');
  const [gameMode, setGameMode] = useState<'study' | 'quiz' | 'memory'>(initialGameMode);
  const [lexiconType, setLexiconType] = useState<'vocabulary' | 'idiom' | 'phrasal verb'>('vocabulary');
  const [timer, setTimer] = useState(0);

  // Quiz-specific
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);

  // Memory
  const [incorrectWords, setIncorrectWords] = useState<FlashcardData[]>([]);
  const [sampleFlashcards, setSampleFlashcards] = useState<FlashcardData[]>([]);
  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT;

  // Fetch cards
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
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameActive, isPaused, gameSession.sessionComplete]);

  // Quiz options generation
  useEffect(() => {
    if (gameMode !== 'quiz' || flashcards.length === 0) return;
    const current = flashcards[gameSession.currentCardIndex];
    const others = flashcards
      .filter((_, idx) => idx !== gameSession.currentCardIndex)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(c => c.word);
    const all = [current.word, ...others].sort(() => Math.random() - 0.5);
    setQuizOptions(all);
    setSelectedOption(null);
    setWasCorrect(null);
    setGameSession(prev => ({ ...prev, showAnswer: false }));
  }, [gameMode, flashcards, gameSession.currentCardIndex]);

  // Handlers
  const initializeGame = (
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed',
    mode: 'study' | 'quiz' | 'memory'
  ) => {
    let filteredCards = [...sampleFlashcards];
    if (difficulty !== 'mixed') {
      filteredCards = sampleFlashcards.filter(card => card.difficulty === difficulty);
    }
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
      sessionComplete: false,
    });
    setIsGameActive(true);
    setIsPaused(false);
    setTimer(0);
  };

  const nextCard = () => {
    if (gameSession.currentCardIndex < flashcards.length - 1) {
      setGameSession(prev => ({
        ...prev,
        currentCardIndex: prev.currentCardIndex + 1,
        showAnswer: false,
        cardsReviewed: prev.cardsReviewed + 1,
      }));
    } else {
      setGameSession(prev => ({ ...prev, sessionComplete: true }));
      setIsGameActive(false);
    }
  };

  const previousCard = () => {
    if (gameSession.currentCardIndex > 0) {
      setGameSession(prev => ({
        ...prev,
        currentCardIndex: prev.currentCardIndex - 1,
        showAnswer: false,
      }));
    }
  };

  // Shared toggle
  const toggleAnswer = () => {
    setGameSession(prev => ({ ...prev, showAnswer: !prev.showAnswer }));
  };

  // Shuffle
  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setGameSession(prev => ({ ...prev, currentCardIndex: 0, showAnswer: false }));
  };

  // Reset
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
      sessionComplete: false,
    });
    setIsGameActive(false);
    setIsPaused(false);
    setTimer(0);
    setQuizOptions([]);
    setSelectedOption(null);
    setWasCorrect(null);
    setIncorrectWords([]);
  };

  const togglePause = () => setIsPaused(!isPaused);

  // Quiz logic
  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;
    const isCorrect = option === flashcards[gameSession.currentCardIndex].word;
    setSelectedOption(option);
    setWasCorrect(isCorrect);
    if (!isCorrect) {
      setIncorrectWords(prev => [...prev, flashcards[gameSession.currentCardIndex]]);
    }
    setGameSession(prev => ({ ...prev, showAnswer: true }));
    setFlashcards(prev =>
      prev.map(card =>
        card.id === flashcards[gameSession.currentCardIndex].id
          ? {
              ...card,
              attempts: card.attempts + 1,
              correctStreak: isCorrect ? card.correctStreak + 1 : 0,
              memorized: isCorrect && card.correctStreak >= 2,
            }
          : card
      )
    );
    setGameSession(prev => ({
      ...prev,
      totalAnswers: prev.totalAnswers + 1,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      score: isCorrect ? prev.score + 10 : prev.score,
    }));
    // Optionally: auto-advance after delay
    setTimeout(nextCard, 1200);
  };

  // Helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Game setup screen
  if (!isGameActive && !gameSession.sessionComplete) {
    // ... (Your setup UI stays the same as before)
    // Not shown here to focus on the game mode logic
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Flashcard Memory Game</h2>
        {/* Game mode/difficulty/lexicon type selection UI */}
        <Button
          onClick={() => initializeGame(selectedDifficulty, gameMode)}
          size="lg"
          className="px-8"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Flashcard Game
        </Button>
        <Button variant="outline" onClick={onBack} className="ml-4">
          <Home className="w-4 h-4 mr-2" />
          Back to Games
        </Button>
      </div>
    );
  }

  // Game completion screen
  if (gameSession.sessionComplete) {
    const accuracy =
      gameSession.totalAnswers > 0
        ? (gameSession.correctAnswers / gameSession.totalAnswers) * 100
        : 0;
    const memorizedCount = flashcards.filter(card => card.memorized).length;
    return (
      <div className="max-w-2xl mx-auto text-center">
        <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4">Session Complete! ⚡</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {gameSession.score}
            </div>
            <div className="text-sm text-gray-600">Score</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {Math.round(accuracy)}%
            </div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {memorizedCount}
            </div>
            <div className="text-sm text-gray-600">Memorized</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {formatTime(gameSession.timeElapsed)}
            </div>
            <div className="text-sm text-gray-600">Time</div>
          </div>
        </div>
        {incorrectWords.length > 0 && (
          <div className="mb-8 text-left">
            <h3 className="font-semibold mb-2">Missed Words</h3>
            <ul className="list-disc list-inside space-y-1">
              {incorrectWords.map(card => (
                <li key={card.id}>
                  <span className="font-medium">{card.word}</span> - {card.definition}
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button onClick={resetGame} size="lg">
          <RotateCcw className="w-4 h-4 mr-2" />
          Play Again
        </Button>
        <Button variant="outline" onClick={onBack} size="lg" className="ml-4">
          <Home className="w-4 h-4 mr-2" />
          Back to Games
        </Button>
      </div>
    );
  }

  // Show current card in chosen mode
  const currentCard = flashcards[gameSession.currentCardIndex];
  if (!currentCard) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Game Header and Progress */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <span className="capitalize font-bold">{gameMode} Mode</span>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>{formatTime(timer)}</span>
            <Target className="w-4 h-4 text-purple-500" />
            <span>
              Card: {gameSession.currentCardIndex + 1}/{flashcards.length}
            </span>
            <Star className="w-4 h-4 text-yellow-500" />
            <span>Score: {gameSession.score}</span>
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
      <Progress value={((gameSession.currentCardIndex + 1) / flashcards.length) * 100} className="w-full mb-6" />

      {/* Render the appropriate mode */}
      {gameMode === 'study' && (
        <StudyMode
          currentCard={currentCard}
          showAnswer={gameSession.showAnswer}
          onToggleAnswer={toggleAnswer}
          onNextCard={nextCard}
          onPreviousCard={previousCard}
          isFirst={gameSession.currentCardIndex === 0}
          isLast={gameSession.currentCardIndex === flashcards.length - 1}
        />
      )}
      {gameMode === 'quiz' && (
        <QuizMode
          currentCard={currentCard}
          options={quizOptions}
          selectedOption={selectedOption}
          wasCorrect={wasCorrect}
          showAnswer={gameSession.showAnswer}
          onSelectOption={handleOptionSelect}
          onNextCard={nextCard}
          isLast={gameSession.currentCardIndex === flashcards.length - 1}
        />
      )}
      {gameMode === 'memory' && (
        <MemoryChallenge
          currentCard={currentCard}
          showAnswer={gameSession.showAnswer}
          onToggleAnswer={toggleAnswer}
          onNextCard={nextCard}
          onPreviousCard={previousCard}
          isFirst={gameSession.currentCardIndex === 0}
          isLast={gameSession.currentCardIndex === flashcards.length - 1}
        />
      )}
    </div>
  );
};

export default FlashcardMemoryGame;
