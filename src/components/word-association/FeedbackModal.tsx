import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Clock, Trophy, XCircle, CheckCircle } from 'lucide-react';
import type { GameRound } from './types';

interface FeedbackModalProps {
  feedback: string | null;
  currentRound: GameRound | null;
  selectedWords: string[];
  closeFeedback: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  feedback,
  currentRound,
  selectedWords,
  closeFeedback,
}) => (
  <>
    {feedback && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={closeFeedback}
      >
        <Card onClick={(e) => e.stopPropagation()}>
          <CardContent className="p-8 text-center">
            <div className="mb-4">
              {feedback.includes('Perfect') && <Trophy className="w-12 h-12 text-yellow-500 mx-auto" />}
              {feedback.includes('Partially') && <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />}
              {feedback.includes('Better luck') && <XCircle className="w-12 h-12 text-red-500 mx-auto" />}
              {feedback.includes("Time's up") && <Clock className="w-12 h-12 text-orange-500 mx-auto" />}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feedback}</h3>
            {currentRound && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-2">Correct answers were:</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {currentRound.relatedWords.map((word) => (
                    <Badge key={word} variant="success">
                      {word}
                    </Badge>
                  ))}
                </div>
                <p className="mt-4 mb-2">Your selections:</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {selectedWords.map((word) => (
                    <Badge key={word} variant={currentRound.relatedWords.includes(word) ? 'success' : 'destructive'}>
                      {word}
                    </Badge>
                  ))}
                </div>
                {currentRound.targetMeaning && (
                  <p className="mt-4">
                    <strong>Definition:</strong> {currentRound.targetMeaning}
                  </p>
                )}
                {currentRound.synonyms && currentRound.synonyms.length > 0 && (
                  <div className="mt-2">
                    <strong>Synonyms:</strong>
                    <div className="flex flex-wrap gap-1 mt-1 justify-center">
                      {currentRound.synonyms.map((word) => (
                        <Badge key={word} variant="success">
                          {word}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {currentRound.antonyms && currentRound.antonyms.length > 0 && (
                  <div className="mt-2">
                    <strong>Antonyms:</strong>
                    <div className="flex flex-wrap gap-1 mt-1 justify-center">
                      {currentRound.antonyms.map((word) => (
                        <Badge key={word} variant="destructive">
                          {word}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                {currentRound.guidewords && currentRound.guidewords.length > 0 && (
                  <p className="mt-2">
                    <strong>Guideword:</strong> {currentRound.guidewords.join(', ')}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    )}
  </>
);

export default FeedbackModal;
