import React, { useEffect, useState, useRef } from "react";
import { Card, CardHeader, CardContent } from "../../ui/card";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { Badge } from "../../ui/badge";
import {
  Play,
  RotateCcw,
  Trophy,
  Timer,
  ArrowLeft,
  ArrowRight,
  Target,
  Star,
} from "lucide-react";

const ChallengeHeader: React.FC<{
  current: number;
  total: number;
  score: number;
  timer?: number;
}> = ({ current, total, score, timer }) => (
  <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
    <div className="flex items-center gap-3">
      <span className="font-bold text-xl tracking-wide bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
        Memory Challenge
      </span>
      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-700">
        <Target className="w-4 h-4 text-purple-400" />
        <span className="font-semibold text-purple-200">
          Card: {current}/{total}
        </span>
      </span>
      <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-900/40 border border-yellow-600">
        <Star className="w-4 h-4 text-yellow-300" />
        <span className="font-semibold text-yellow-200">Score: {score}</span>
      </span>
      {typeof timer === "number" && (
        <span className="flex items-center gap-1 px-4 py-1 rounded-full bg-blue-900/50 shadow-inner border border-blue-600">
          <Timer className="w-5 h-5 text-blue-400" />
          <span className="font-mono text-lg tracking-widest text-blue-200">
            {timer}s
          </span>
        </span>
      )}
    </div>
  </div>
);

interface FlashcardData {
  id: string;
  word: string;
  definition: string;
  example: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  memorized: boolean;
  attempts: number;
  correctStreak: number;
}

interface MemoryChallengeProps {
  flashcards?: FlashcardData[];
}

const CHALLENGE_LENGTH = 10;
const FLASHCARD_INTERVAL = 2000;
const QUIZ_TIME_LIMIT = 5;

const MemoryChallenge: React.FC<MemoryChallengeProps> = ({ flashcards = [] }) => {
  const [phase, setPhase] = useState<"show" | "quiz" | "results">("show");
  const [showIndex, setShowIndex] = useState(0);

  const [quizQuestions, setQuizQuestions] = useState<
    { definition: string; correct: string; options: string[] }[]
  >([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ correct: boolean; answer: string }[]>([]);
  const [timer, setTimer] = useState(QUIZ_TIME_LIMIT);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [highScore, setHighScore] = useState(
    () => Number(localStorage.getItem("memoryChallengeHighScore")) || 0
  );

  // Reset logic
  useEffect(() => {
    setPhase("show");
    setShowIndex(0);
    setQuizQuestions([]);
    setQuizIndex(0);
    setUserAnswers([]);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimer(QUIZ_TIME_LIMIT);
  }, [flashcards]);

  // Phase 1: Card display
  useEffect(() => {
    if (phase !== "show") return;
    if (showIndex < CHALLENGE_LENGTH - 1) {
      const t = setTimeout(() => setShowIndex((i) => i + 1), FLASHCARD_INTERVAL);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase("quiz"), FLASHCARD_INTERVAL + 500);
      return () => clearTimeout(t);
    }
  }, [phase, showIndex]);

  // Quiz questions
  useEffect(() => {
    if (phase === "quiz" && quizQuestions.length === 0 && flashcards.length) {
      try {
        const cardsUsed =
          flashcards.length >= CHALLENGE_LENGTH
            ? flashcards.slice(0, CHALLENGE_LENGTH)
            : flashcards;
        const questions = cardsUsed.map((card, idx) => {
          let otherWords = cardsUsed.filter((_, i) => i !== idx).map((c) => c.word);
          if (otherWords.length < 3) {
            otherWords = [
              ...otherWords,
              ...flashcards.filter((fc) => !cardsUsed.includes(fc)).map((fc) => fc.word),
            ];
          }
          const options = [card.word, ...otherWords.sort(() => Math.random() - 0.5).slice(0, 3)];
          return {
            definition: card.definition,
            correct: card.word,
            options: options.sort(() => Math.random() - 0.5),
          };
        });
        setQuizQuestions(questions);
        setQuizIndex(0);
        setUserAnswers([]);
        setScore(0);
        setStreak(0);
        setBestStreak(0);
        setTimer(QUIZ_TIME_LIMIT);
      } catch (err) {
        console.error("Quiz question generation failed", err);
      }
    }
  }, [phase, flashcards, quizQuestions.length]);

  // Timer for quiz
  useEffect(() => {
    if (phase !== "quiz" || quizIndex >= quizQuestions.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setTimer(QUIZ_TIME_LIMIT);
    timerRef.current = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, quizIndex, quizQuestions.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (phase === "show") {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          nextShow();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          prevShow();
        }
      } else if (phase === "quiz") {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          nextQuiz();
        } else if (e.key === "ArrowLeft") {
          e.preventDefault();
          prevQuiz();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, showIndex, quizIndex]);

  useEffect(() => {
    if (phase === "quiz" && timer <= 0) {
      handleAnswer(null);
    }
    // eslint-disable-next-line
  }, [timer]);

  const handleAnswer = (answer: string | null) => {
    if (quizIndex >= quizQuestions.length) return;
    const q = quizQuestions[quizIndex];
    const correct = answer === q.correct;
    setUserAnswers((prev) => [...prev, { correct, answer: answer || "" }]);
    if (correct) {
      setScore((s) => s + 10 + streak * 2);
      setStreak((s) => {
        const next = s + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
    } else {
      setStreak(0);
    }
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex((i) => i + 1);
      setTimer(QUIZ_TIME_LIMIT);
    } else {
      setPhase("results");
      setBestStreak((s) => Math.max(s, streak));
      setTimeout(() => {
        setHighScore((prev) => {
          if (score > prev) {
            localStorage.setItem("memoryChallengeHighScore", String(score));
            return score;
          }
          return prev;
        });
      }, 200);
    }
  };

  const prevQuiz = () => {
    if (quizIndex > 0) {
      setQuizIndex((i) => i - 1);
      setTimer(QUIZ_TIME_LIMIT);
    }
  };

  const nextQuiz = () => {
    if (quizIndex < quizQuestions.length - 1) {
      setQuizIndex((i) => i + 1);
      setTimer(QUIZ_TIME_LIMIT);
    }
  };

  const prevShow = () => {
    if (showIndex > 0) {
      setShowIndex((i) => i - 1);
    }
  };

  const nextShow = () => {
    if (showIndex < CHALLENGE_LENGTH - 1) {
      setShowIndex((i) => i + 1);
    } else {
      setPhase("quiz");
    }
  };

  const restart = () => {
    setPhase("show");
    setShowIndex(0);
    setQuizQuestions([]);
    setQuizIndex(0);
    setUserAnswers([]);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setTimer(QUIZ_TIME_LIMIT);
  };

  // Guard
if (!flashcards || flashcards.length < CHALLENGE_LENGTH) {
  return (
    <div className="text-center py-10 text-lg">
      Not enough cards for Memory Challenge!
    </div>
  );
}


  // PHASE 1: Show
  if (phase === "show") {
    const card = flashcards[showIndex];
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ChallengeHeader current={showIndex + 1} total={CHALLENGE_LENGTH} score={score} />
        <Card className="w-full max-w-xl text-center border shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Badge variant="secondary">{card.category}</Badge>
              <Badge
                className={
                  card.difficulty === "easy"
                    ? "bg-green-500"
                    : card.difficulty === "medium"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }
              >
                {card.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="py-10">
              <span className="block text-4xl font-bold text-purple-500">
                {card.word}
              </span>
              <span className="block text-lg text-gray-300 mt-2 italic">
                {card.definition}
              </span>
            </div>
            <Progress
              value={((showIndex + 1) / CHALLENGE_LENGTH) * 100}
              className="w-full"
            />
            <div className="mt-4 text-gray-400 text-sm">
              Memorize each word & definition! Card {showIndex + 1} of {CHALLENGE_LENGTH}
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-between w-full max-w-xl mt-4">
          <Button onClick={prevShow} variant="outline" disabled={showIndex === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Prev
          </Button>
          <Button onClick={nextShow}>
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // PHASE 2: Quiz
  if (phase === "quiz") {
    if (quizQuestions.length === 0) {
      return (
        <div className="text-center py-10 text-lg">Preparing questions...</div>
      );
    }
    const q = quizQuestions[quizIndex];
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ChallengeHeader
          current={quizIndex + 1}
          total={quizQuestions.length}
          score={score}
          timer={timer}
        />
        <Card className="w-full max-w-xl text-center border shadow-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Badge variant="secondary">Quiz Round</Badge>
              <div className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-purple-400" />
                <span
                  className={`font-mono text-lg ${
                    timer <= 2 ? "text-red-400" : "text-purple-300"
                  }`}
                >
                  {timer}s
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="py-8">
              <span className="block text-xl mb-3 text-purple-400">
                Which word matches this definition?
              </span>
              <span className="block text-lg font-medium text-gray-300 mb-6 italic">
                {q.definition}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {q.options.map((word) => (
                  <Button
                    key={word}
                    size="lg"
                    variant="outline"
                    className="font-bold text-lg"
                    onClick={() => handleAnswer(word)}
                  >
                    {word}
                  </Button>
                ))}
              </div>
              <Progress
                value={((quizIndex + 1) / quizQuestions.length) * 100}
                className="w-full"
              />
            </div>
            <div className="flex justify-between mt-6 text-purple-400 text-sm">
              <span>
                Score: <span className="font-bold">{score}</span>
              </span>
              <span>
                Streak: <span className="font-bold">{streak}</span>
              </span>
              <span>
                Best: <span className="font-bold">{bestStreak}</span>
              </span>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-between w-full max-w-xl mt-4">
          <Button onClick={prevQuiz} variant="outline" disabled={quizIndex === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Prev
          </Button>
          <Button onClick={nextQuiz} disabled={quizIndex === quizQuestions.length - 1}>
            Next <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // PHASE 3: Results
  if (phase === "results") {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <ChallengeHeader current={quizQuestions.length} total={quizQuestions.length} score={score} />
        <Card className="w-full max-w-md text-center border shadow-md">
          <CardHeader>
            <Trophy className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
            <div className="text-2xl font-bold text-purple-400 mb-1">
              Memory Challenge Complete!
            </div>
            <div className="text-lg text-gray-300 mb-4">Your Results</div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between mb-4">
              <div className="flex-1 text-left">Score:</div>
              <div className="flex-1 text-right font-bold text-yellow-300">{score}</div>
            </div>
            <div className="flex justify-between mb-4">
              <div className="flex-1 text-left">Best Streak:</div>
              <div className="flex-1 text-right font-bold text-purple-300">
                {bestStreak}
              </div>
            </div>
            <div className="flex justify-between mb-4">
              <div className="flex-1 text-left">High Score:</div>
              <div className="flex-1 text-right font-bold text-purple-300">
                {Math.max(highScore, score)}
              </div>
            </div>
            <div className="mt-6">
              <Button
                onClick={restart}
                size="lg"
                className="w-full font-semibold mb-2"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

export default MemoryChallenge;
