import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import SetupScreen from './word-association/SetupScreen';
import CompletionScreen from './word-association/CompletionScreen';
import PauseOverlay from './word-association/PauseOverlay';
import FeedbackModal from './word-association/FeedbackModal';
import type { WordGroup, GameRound, GameMode } from './word-association/types';
import {
  fetchVocabularyGroups,
  buildVocabularyRound,
} from './word-association/modes/vocabulary';
import {
  fetchIdiomGroups,
  buildIdiomRound,
} from './word-association/modes/idiom';
import {
  fetchPhrasalVerbGroups,
  buildPhrasalVerbRound,
} from './word-association/modes/phrasalVerb';
import {
  fetchSynAntGroups,
  buildSynAntRound,
} from './word-association/modes/synAnt';
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
  const [noWordsAvailable, setNoWordsAvailable] = useState(false);
  const [mode, setMode] = useState<GameMode>('vocabulary');
  const [usedWords, setUsedWords] = useState<string[]>([]);
  const API_URL = import.meta.env.VITE_SERVER_ENDPOINT;

  useEffect(() => {
    const loadGroups = async () => {
      try {
        let groups: WordGroup[] = [];
        if (mode === 'vocabulary') {
          groups = await fetchVocabularyGroups(API_URL);
        } else if (mode === 'idiom') {
          groups = await fetchIdiomGroups(API_URL);
        } else if (mode === 'phrasal verb') {
          groups = await fetchPhrasalVerbGroups(API_URL);
        } else {
          groups = await fetchSynAntGroups(API_URL);
        }
        setWordGroups(groups);
        setNoWordsAvailable(groups.length === 0);
      } catch {
        setWordGroups([]);
        setNoWordsAvailable(true);
      }
    };
    loadGroups();
  }, [API_URL, mode]);

  // Distractor words fetched from the database
  const [distractorWords, setDistractorWords] = useState<string[]>([]);

  useEffect(() => {
    // Fetch a random subset once to minimize network load
    fetch(`${API_URL}lexicon/words?limit=80`)
      .then(res => res.json())
      .then(data => {
        if (data.response) {
          setDistractorWords(data.response.map((w: any) => w.Word));
        }
      })
      .catch(() => {});
  }, [API_URL]);

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

  const generateRound = (roundNum: number = roundNumber) => {
    const filteredGroups = wordGroups
      .map(g => ({
        ...g,
        words: g.words.filter(w => !usedWords.includes(w.text)),
      }))
      .filter(g => g.words.length > 0);

    const validGroups = filteredGroups.length > 0 ? filteredGroups : wordGroups;

    if (validGroups.length === 0) {
      setIsGameActive(false);
      setNoWordsAvailable(true);
      return;
    }

    const randomGroup =
      validGroups[Math.floor(Math.random() * validGroups.length)];
    const randomItem =
      randomGroup.words[Math.floor(Math.random() * randomGroup.words.length)];

    let newRound: GameRound;
    if (mode === 'vocabulary') {
      newRound = buildVocabularyRound(
        randomGroup,
        randomItem,
        roundNum,
        distractorWords,
        difficulty
      );
    } else if (mode === 'syn-ant') {
      newRound = buildSynAntRound(
        randomGroup,
        randomItem,
        roundNum,
        distractorWords,
        difficulty
      );
    } else {
      const allMeanings = wordGroups
        .flatMap(g => g.words.map(w => w.meaning).filter(Boolean));
      if (mode === 'idiom') {
        newRound = buildIdiomRound(
          randomGroup,
          randomItem,
          roundNum,
          difficulty,
          allMeanings
        );
      } else {
        newRound = buildPhrasalVerbRound(
          randomGroup,
          randomItem,
          roundNum,
          difficulty,
          allMeanings
        );
      }
    }

    setCurrentRound(newRound);
    setUsedWords(prev => [...prev, randomItem.text]);
    setSelectedWords([]);
    setFeedback(null);
    setTimeLeft(difficulty === 'easy' ? 45 : difficulty === 'medium' ? 30 : 20);
  };

  // Start game
  const startGame = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    if (wordGroups.filter(g => g.words.length > 0).length === 0) {
      setNoWordsAvailable(true);
      return;
    }

    setNoWordsAvailable(false);

    setDifficulty(selectedDifficulty);
    setIsGameActive(true);
    setIsGameComplete(false);
    setRoundNumber(1);
    setScore(0);
    setGameStats({ correctAnswers: 0, totalTime: 0, accuracy: 0 });
    setUsedWords([]);
    generateRound(1);
  };

  // Handle word selection
  const handleWordSelect = (word: string) => {
    if (isPaused || !currentRound) return;

    if (mode === 'idiom' || mode === 'phrasal verb') {
      // Only one selection allowed for meaning based rounds
      if (selectedWords.includes(word)) {
        setSelectedWords([]);
      } else {
        setSelectedWords([word]);
      }
    } else {
      if (selectedWords.includes(word)) {
        setSelectedWords(prev => prev.filter(w => w !== word));
      } else {
        const max = Math.max(1, currentRound.relatedWords.length);
        if (selectedWords.length < max) {
          setSelectedWords(prev => [...prev, word]);
        }
      }
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
    
    let message = '';
    if (correctCount === currentRound.relatedWords.length && incorrectCount === 0) {
      message = `Perfect! +${totalRoundScore} points`;
      setGameStats(prev => ({ ...prev, correctAnswers: prev.correctAnswers + 1 }));
    } else if (correctCount === 0) {
      message = `Better luck next time. +${totalRoundScore} points`;
    } else {
      message = `Partially correct. +${totalRoundScore} points`;
    }

    setFeedback(message);
    setIsPaused(true);

    // Wait for user to close feedback
  };

  // Handle time up
  const handleTimeUp = () => {
    if (!currentRound) return;

    setFeedback('Time\'s up!');
    setIsPaused(true);
    // Wait for user to close feedback
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
    setUsedWords([]);
  };

  // Toggle pause
  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const advanceRound = () => {
    if (roundNumber >= totalRounds) {
      completeGame();
    } else {
      setRoundNumber(prev => {
        const next = prev + 1;
        generateRound(next);
        return next;
      });
    }
  };

  const closeFeedback = () => {
    setFeedback(null);
    setIsPaused(false);
    advanceRound();
  };

  // Game setup screen
  if (!isGameActive && !isGameComplete) {
    return (
      <SetupScreen
        mode={mode}
        setMode={setMode}
        startGame={startGame}
        noWordsAvailable={noWordsAvailable}
        onBack={onBack}
      />
    );
  }

  // Game completion screen
  if (isGameComplete) {
    return (
      <CompletionScreen
        totalRounds={totalRounds}
        score={score}
        accuracy={gameStats.accuracy}
        correctAnswers={gameStats.correctAnswers}
        totalTime={gameStats.totalTime}
        resetGame={resetGame}
        onBack={onBack}
      />
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
      <PauseOverlay isPaused={isPaused} togglePause={togglePause} />

      {currentRound && (
        <>
          {/* Game Content */}
          <Card className="mb-6">
            <CardHeader>
              <div className="text-center">
                <CardTitle className="text-2xl mb-2">
                  {mode === 'vocabulary'
                    ? 'Find words related to:'
                    : mode === 'syn-ant'
                    ? (
                        <>Select <span className={`font-bold ${currentRound.relationType === 'synonym' ? 'text-green-600' : 'text-red-600'}`}>{currentRound.relationType === 'synonym' ? 'synonyms' : 'antonyms'}</span> for:</>
                      )
                    : 'What is the meaning of:'}
                </CardTitle>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                  {currentRound.targetWord.toUpperCase()}
                </div>
                {currentRound.guidewords && currentRound.guidewords.length > 0 && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                    {currentRound.guidewords.join(', ')}
                  </div>
                )}
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
                    {mode === 'vocabulary'
                      ? `Select ${Math.max(1, currentRound.relatedWords.length)} related word${Math.max(1, currentRound.relatedWords.length) > 1 ? 's' : ''}`
                      : mode === 'syn-ant'
                      ? (
                          <>Select {Math.max(1, currentRound.relatedWords.length)} <span className={`font-bold ${currentRound.relationType === 'synonym' ? 'text-green-600' : 'text-red-600'}`}>{currentRound.relationType === 'synonym' ? 'synonym' : 'antonym'}{Math.max(1, currentRound.relatedWords.length) > 1 ? 's' : ''}</span></>
                        )
                      : 'Select the correct meaning'}
                  </span>
                </div>
                {(mode === 'vocabulary' || mode === 'syn-ant') && (
                  <div className="text-xs text-gray-500">
                    Selected: {selectedWords.length} / {Math.max(1, currentRound.relatedWords.length)}
                  </div>
                )}
              </div>

              {/* Word Options */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6 items-stretch">
                {currentRound.allOptions.map((option, index) => (
                  <motion.div
                    key={`${option}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      variant={selectedWords.includes(option) ? "default" : "outline"}
                      className={`w-full h-full py-4 text-sm whitespace-normal break-words ${
                        selectedWords.includes(option)
                          ? 'bg-purple-600 hover:bg-purple-700'
                          : 'hover:bg-purple-50 dark:hover:bg-purple-900/20'
                      }`}
                      onClick={() => handleWordSelect(option)}
                      disabled={isPaused}
                    >
                      {option}
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
          <FeedbackModal
            feedback={feedback}
            currentRound={currentRound}
            selectedWords={selectedWords}
            closeFeedback={closeFeedback}
          />
        </>
      )}
    </div>
  );
};

export default WordAssociationGame;
