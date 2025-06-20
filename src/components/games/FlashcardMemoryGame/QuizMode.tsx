import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

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

interface QuizModeProps {
  currentCard: FlashcardData;
  options: string[];
  selectedOption: string | null;
  wasCorrect: boolean | null;
  showAnswer: boolean;
  onSelectOption: (option: string) => void;
  onNextCard: () => void;
  isLast: boolean;
}

const QuizMode: React.FC<QuizModeProps> = ({
  currentCard,
  options,
  selectedOption,
  wasCorrect,
  showAnswer,
  onSelectOption,
  onNextCard,
  isLast,
}) => {
  if (!currentCard) return null;

  return (
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
                <Badge className={
                  currentCard.difficulty === 'easy'
                    ? 'bg-green-500'
                    : currentCard.difficulty === 'medium'
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }>
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
        <CardContent>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">
              Guess the Word
            </h3>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 mb-4">
              <p className="text-lg text-gray-800 dark:text-gray-200">
                {currentCard.definition}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!showAnswer ? (
                <motion.div
                  key="options"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-2 gap-2"
                >
                  {options.map(opt => (
                    <Button
                      key={opt}
                      onClick={() => onSelectOption(opt)}
                      disabled={!!selectedOption}
                      variant={selectedOption === opt
                        ? wasCorrect
                          ? "success"
                          : "destructive"
                        : "outline"}
                      className="w-full"
                    >
                      {opt}
                    </Button>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="flex items-center gap-2">
                    {wasCorrect ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <span className={wasCorrect ? "text-green-600" : "text-red-600"}>
                      {wasCorrect ? "Correct!" : `Incorrect. Answer: ${currentCard.word}`}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 italic">
                    Example: "{currentCard.example}"
                  </div>
                  <Button onClick={onNextCard} disabled={isLast}>
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuizMode;
