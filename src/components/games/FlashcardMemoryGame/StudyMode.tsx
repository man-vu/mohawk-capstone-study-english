import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react';

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

interface StudyModeProps {
  currentCard: FlashcardData;
  showAnswer: boolean;
  onToggleAnswer: () => void;
  onNextCard: () => void;
  onPreviousCard: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const StudyMode: React.FC<StudyModeProps> = ({
  currentCard,
  showAnswer,
  onToggleAnswer,
  onNextCard,
  onPreviousCard,
  isFirst,
  isLast,
}) => {
  // Keyboard shortcuts: Left, Right, Space
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'ArrowRight' && !isLast) {
        e.preventDefault();
        onNextCard();
      } else if (e.key === 'ArrowLeft' && !isFirst) {
        e.preventDefault();
        onPreviousCard();
      } else if ((e.key === ' ' || e.code === 'Space') && !showAnswer) {
        e.preventDefault();
        onToggleAnswer();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isFirst, isLast, onNextCard, onPreviousCard, showAnswer, onToggleAnswer]);

  if (!currentCard) return null;

  return (
    <div>
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
          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="text-center mb-6">
              <h3 className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                {currentCard.word}
              </h3>

              <AnimatePresence mode="wait">
                {showAnswer ? (
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
                    <Button onClick={onToggleAnswer} size="lg">
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

      {/* Navigation Controls */}
      <div className="flex justify-between items-center mt-6">
        <Button
          onClick={onPreviousCard}
          variant="outline"
          disabled={isFirst}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={onNextCard}
          disabled={isLast}
        >
          Next Card
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default StudyMode;
