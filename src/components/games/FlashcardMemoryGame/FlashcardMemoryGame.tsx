import React, { useState, useEffect } from "react";
import GameSetup from "./GameSetup";
import GameHeader from "./GameHeader";
import GameCompletion from "./GameCompletion";
import StudyMode from "./StudyMode";
import QuizMode from "./QuizMode";
import MemoryChallenge from "./MemoryChallenge";

// --- Type Definitions (reuse as before)
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
  initialGameMode = "study",
}) => {
  // --- State
  const [sampleFlashcards, setSampleFlashcards] = useState<FlashcardData[]>([]);
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
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<'easy' | 'medium' | 'hard' | 'mixed'>("mixed");
  const [gameMode, setGameMode] =
    useState<'study' | 'quiz' | 'memory'>(initialGameMode);
  const [lexiconType, setLexiconType] =
    useState<'vocabulary' | 'idiom' | 'phrasal verb'>("vocabulary");
  const [timer, setTimer] = useState(0);
  const [memoryHeader, setMemoryHeader] = useState({
    current: 0,
    total: 0,
    score: 0,
    timer: undefined as number | undefined,
  });

  // Quiz-specific
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [wasCorrect, setWasCorrect] = useState<boolean | null>(null);

  // Completion
  const [incorrectWords, setIncorrectWords] = useState<FlashcardData[]>([]);

  // API URL
  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT;

  // Fetch cards on lexiconType change
  useEffect(() => {
    fetch(`${API_URL}lexicon/words?type=${encodeURIComponent(lexiconType)}&limit=100`)
      .then((res) => res.json())
      .then((data) => {
        if (data.response) {
          const mapped = data.response.map((w: any, idx: number) => ({
            id: String(w.WordId || idx),
            word: w.Word,
            definition: w.Definition,
            example: w.Example || "",
            difficulty: (w.Difficulty || "medium") as 'easy' | 'medium' | 'hard',
            category: w.Category || "General",
            memorized: false,
            attempts: 0,
            correctStreak: 0,
          }));
          setSampleFlashcards(mapped);
        }
      })
      .catch(() => {});
  }, [API_URL, lexiconType]);

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isGameActive && !isPaused && !gameSession.sessionComplete) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
        setGameSession((prev) => ({ ...prev, timeElapsed: prev.timeElapsed + 1 }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameActive, isPaused, gameSession.sessionComplete]);

  // Quiz Mode: generate options when card changes
  useEffect(() => {
    if (gameMode !== "quiz" || flashcards.length === 0) return;
    const current = flashcards[gameSession.currentCardIndex];
    const others = flashcards
      .filter((_, idx) => idx !== gameSession.currentCardIndex)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((c) => c.word);
    const all = [current.word, ...others].sort(() => Math.random() - 0.5);
    setQuizOptions(all);
    setSelectedOption(null);
    setWasCorrect(null);
    setGameSession((prev) => ({ ...prev, showAnswer: false }));
  }, [gameMode, flashcards, gameSession.currentCardIndex]);

  // --- Logic handlers (move most UI out, keep only logic)
  const initializeGame = (
    difficulty: 'easy' | 'medium' | 'hard' | 'mixed',
    mode: 'study' | 'quiz' | 'memory'
  ) => {
    let filteredCards = [...sampleFlashcards];
    if (difficulty !== "mixed") {
      filteredCards = sampleFlashcards.filter((card) => card.difficulty === difficulty);
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
    setIncorrectWords([]);
  };

  const nextCard = () => {
    if (gameSession.currentCardIndex < flashcards.length - 1) {
      setGameSession((prev) => ({
        ...prev,
        currentCardIndex: prev.currentCardIndex + 1,
        showAnswer: false,
        cardsReviewed: prev.cardsReviewed + 1,
      }));
    } else {
      setGameSession((prev) => ({ ...prev, sessionComplete: true }));
      setIsGameActive(false);
    }
  };

  const previousCard = () => {
    if (gameSession.currentCardIndex > 0) {
      setGameSession((prev) => ({
        ...prev,
        currentCardIndex: prev.currentCardIndex - 1,
        showAnswer: false,
      }));
    }
  };

  const toggleAnswer = () => {
    setGameSession((prev) => ({ ...prev, showAnswer: !prev.showAnswer }));
  };

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5);
    setFlashcards(shuffled);
    setGameSession((prev) => ({
      ...prev,
      currentCardIndex: 0,
      showAnswer: false,
    }));
  };

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

  // Quiz: handle answer selection
  const handleOptionSelect = (option: string) => {
    if (selectedOption) return;
    const isCorrect = option === flashcards[gameSession.currentCardIndex].word;
    setSelectedOption(option);
    setWasCorrect(isCorrect);
    if (!isCorrect) {
      setIncorrectWords((prev) => [...prev, flashcards[gameSession.currentCardIndex]]);
    }
    setGameSession((prev) => ({ ...prev, showAnswer: true }));
    setFlashcards((prev) =>
      prev.map((card) =>
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
    setGameSession((prev) => ({
      ...prev,
      totalAnswers: prev.totalAnswers + 1,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      score: isCorrect ? prev.score + 10 : prev.score,
    }));
    nextCard();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- Screens (delegating to subcomponents) ---

  if (!isGameActive && !gameSession.sessionComplete) {
    return (
      <GameSetup
        lexiconType={lexiconType}
        setLexiconType={setLexiconType}
        gameMode={gameMode}
        setGameMode={setGameMode}
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        onStart={() => initializeGame(selectedDifficulty, gameMode)}
        onBack={onBack}
      />
    );
  }

  if (gameSession.sessionComplete) {
    const accuracy =
      gameSession.totalAnswers > 0
        ? (gameSession.correctAnswers / gameSession.totalAnswers) * 100
        : 0;
    const memorizedCount = flashcards.filter((card) => card.memorized).length;
    return (
      <GameCompletion
        score={gameSession.score}
        accuracy={accuracy}
        memorizedCount={memorizedCount}
        time={formatTime(gameSession.timeElapsed)}
        incorrectWords={incorrectWords}
        onPlayAgain={resetGame}
        onBack={onBack}
      />
    );
  }

  // GAME SCREEN: Show current card with mode
  const currentCard = flashcards[gameSession.currentCardIndex];
  if (!currentCard) return null;

  const headerTimer =
    gameMode === "memory" && memoryHeader.timer !== undefined
      ? `${memoryHeader.timer}s`
      : formatTime(timer);
  const headerCurrent =
    gameMode === "memory" ? memoryHeader.current : gameSession.currentCardIndex + 1;
  const headerTotal =
    gameMode === "memory" ? memoryHeader.total : flashcards.length;
  const headerScore = gameMode === "memory" ? memoryHeader.score : gameSession.score;

  return (
    <div className="max-w-4xl mx-auto">
      <GameHeader
        gameMode={gameMode}
        timer={headerTimer}
        currentIndex={headerCurrent}
        totalCards={headerTotal}
        score={headerScore}
        isPaused={isPaused}
        onPauseToggle={togglePause}
        onShuffle={shuffleCards}
        onReset={resetGame}
        onBack={onBack}
      />
      {gameMode === "study" && (
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
      {gameMode === "quiz" && (
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
      {gameMode === "memory" && (
        <MemoryChallenge
          flashcards={flashcards}
          onHeaderUpdate={setMemoryHeader}
        />
      )}
    </div>
  );
};

export default FlashcardMemoryGame;