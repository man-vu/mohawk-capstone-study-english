import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { RotateCcw, Home, Trophy } from 'lucide-react';

interface CompletionScreenProps {
  totalRounds: number;
  score: number;
  accuracy: number;
  correctAnswers: number;
  totalTime: number;
  resetGame: () => void;
  onBack: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({
  totalRounds,
  score,
  accuracy,
  correctAnswers,
  totalTime,
  resetGame,
  onBack,
}) => {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
        <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
      </motion.div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Game Complete! 🧠</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        You've completed all {totalRounds} rounds of word association!
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{score}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Score</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{Math.round(accuracy)}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{correctAnswers}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Perfect Rounds</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
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
};

export default CompletionScreen;
