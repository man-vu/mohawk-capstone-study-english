import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardHeader, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Progress } from '../../ui/progress';
import { RotateCcw } from 'lucide-react';

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

interface MemoryChallengeProps {
  cards: FlashcardData[];
  onBack?: () => void;
}

const PREVIEW_DURATION = 2000; // 2 seconds per card
const ANSWER_TIME = 5; // seconds to answer
const ROUND_SIZE = 10;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

const MemoryChallenge: React.FC<MemoryChallengeProps> = ({ cards, onBack }) => {
  const roundCards = useMemo(
    () => shuffle(cards).slice(0, Math.min(ROUND_SIZE, cards.length)),
    [cards]
  );

  const [phase, setPhase] = useState<'preview' | 'quiz' | 'complete'>('preview');
  const [previewIndex, setPreviewIndex] = useState(0);
  const [quizCards, setQuizCards] = useState<FlashcardData[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [timer, setTimer] = useState(ANSWER_TIME);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Show each card for PREVIEW_DURATION then advance
  useEffect(() => {
    if (phase !== 'preview') return;
    if (previewIndex >= roundCards.length) {
      setQuizCards(shuffle(roundCards));
      setPhase('quiz');
      return;
    }
    const t = setTimeout(() => {
      setPreviewIndex(i => i + 1);
    }, PREVIEW_DURATION);
    return () => clearTimeout(t);
  }, [phase, previewIndex, roundCards]);

  // Prepare question options whenever quizIndex changes
  useEffect(() => {
    if (phase !== 'quiz' || !quizCards[quizIndex]) return;
    const current = quizCards[quizIndex];
    const others = shuffle(roundCards.filter(c => c.id !== current.id))
      .slice(0, 3)
      .map(c => c.word);
    setOptions(shuffle([current.word, ...others]));
    setTimer(ANSWER_TIME);
    setSelectedOption(null);
  }, [phase, quizIndex, quizCards, roundCards]);

  // Countdown timer for quiz phase
  useEffect(() => {
    if (phase !== 'quiz') return;
    if (timer === 0) {
      handleAnswer(null);
      return;
    }
    const interval = setInterval(() => {
      setTimer(t => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, timer]);

  const handleAnswer = (option: string | null) => {
    if (selectedOption) return;
    const current = quizCards[quizIndex];
    const correct = option === current.word;
    setSelectedOption(option);
    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(b => (newStreak > b ? newStreak : b));
      setScore(s => s + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (quizIndex < quizCards.length - 1) {
        setQuizIndex(i => i + 1);
      } else {
        setPhase('complete');
      }
    }, 800);
  };

  const resetGame = () => {
    setPhase('preview');
    setPreviewIndex(0);
    setQuizIndex(0);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setSelectedOption(null);
  };

  // PREVIEW PHASE
  if (phase === 'preview' && roundCards[previewIndex]) {
    const card = roundCards[previewIndex];
    return (
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Memorize the following</h3>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 mb-2">{card.word}</div>
            <p className="text-gray-700 mb-4">{card.definition}</p>
            <Progress
              value={((previewIndex + 1) / roundCards.length) * 100}
              className="mt-4"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // QUIZ PHASE
  if (phase === 'quiz' && quizCards[quizIndex]) {
    const card = quizCards[quizIndex];
    return (
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Which word matches?</h3>
              <span className="text-sm text-gray-500">{timer}s</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{card.definition}</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {options.map(opt => (
                <Button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!selectedOption}
                  variant={
                    selectedOption
                      ? opt === card.word
                        ? 'default'
                        : 'outline'
                      : 'outline'
                  }
                >
                  {opt}
                </Button>
              ))}
            </div>
            <Progress
              value={((quizIndex) / roundCards.length) * 100}
              className="mb-2"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  // COMPLETE PHASE
  if (phase === 'complete') {
    return (
      <div className="max-w-md mx-auto text-center">
        <Card>
          <CardContent>
            <h3 className="text-2xl font-bold mb-4">Round Complete</h3>
            <p className="mb-2">Score: {score}/{roundCards.length}</p>
            <p className="mb-6">Best Streak: {bestStreak}</p>
            <Button onClick={resetGame} className="mr-2">
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                Back
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default MemoryChallenge;
