import React from "react";
import { Button } from "../../ui/button";
import { Card, CardHeader, CardContent } from "../../ui/card";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import { Trophy, RotateCcw, Home, ChevronDown } from "lucide-react";

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

interface GameCompletionProps {
  score: number;
  accuracy: number;
  memorizedCount: number;
  time: string;
  correctWords: FlashcardData[];
  incorrectWords: FlashcardData[];
  missedWords: FlashcardData[];
  onPlayAgain: () => void;
  onBack: () => void;
}

const GameCompletion: React.FC<GameCompletionProps> = ({
  score,
  accuracy,
  memorizedCount,
  time,
  correctWords,
  incorrectWords,
  missedWords,
  onPlayAgain,
  onBack,
}) => (
  <div className="max-w-2xl mx-auto text-center">
    <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-6" />
    <h2 className="text-3xl font-bold mb-4">Session Complete! ⚡</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div>
        <div className="text-2xl font-bold text-purple-600">{score}</div>
        <div className="text-sm text-gray-600">Score</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-green-600">{Math.round(accuracy)}%</div>
        <div className="text-sm text-gray-600">Accuracy</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-blue-600">{memorizedCount}</div>
        <div className="text-sm text-gray-600">Memorized</div>
      </div>
      <div>
        <div className="text-2xl font-bold text-yellow-600">{time}</div>
        <div className="text-sm text-gray-600">Time</div>
      </div>
    </div>
    {(correctWords.length > 0 || incorrectWords.length > 0 || missedWords.length > 0) && (
      <div className="grid md:grid-cols-3 gap-4 mb-8 text-left">
        {correctWords.length > 0 && (
          <Accordion className="border rounded">
            <AccordionSummary expandIcon={<ChevronDown className="w-4 h-4" />} className="font-semibold">
              Correct Words ({correctWords.length})
            </AccordionSummary>
            <AccordionDetails>
              <ul className="list-disc list-inside space-y-1">
                {correctWords.map((card, idx) => (
                  <li key={`${card.id}-${idx}`}>
                    <span className="font-medium">{card.word}</span> - {card.definition}
                  </li>
                ))}
              </ul>
            </AccordionDetails>
          </Accordion>
        )}
        {incorrectWords.length > 0 && (
          <Accordion className="border rounded">
            <AccordionSummary expandIcon={<ChevronDown className="w-4 h-4" />} className="font-semibold">
              Incorrect Words ({incorrectWords.length})
            </AccordionSummary>
            <AccordionDetails>
              <ul className="list-disc list-inside space-y-1">
                {incorrectWords.map((card, idx) => (
                  <li key={`${card.id}-${idx}`}>
                    <span className="font-medium">{card.word}</span> - {card.definition}
                  </li>
                ))}
              </ul>
            </AccordionDetails>
          </Accordion>
        )}
        {missedWords.length > 0 && (
          <Accordion className="border rounded">
            <AccordionSummary expandIcon={<ChevronDown className="w-4 h-4" />} className="font-semibold">
              Missed Words ({missedWords.length})
            </AccordionSummary>
            <AccordionDetails>
              <ul className="list-disc list-inside space-y-1">
                {missedWords.map((card, idx) => (
                  <li key={`${card.id}-${idx}`}>
                    <span className="font-medium">{card.word}</span> - {card.definition}
                  </li>
                ))}
              </ul>
            </AccordionDetails>
          </Accordion>
        )}
      </div>
    )}
    <Button onClick={onPlayAgain} size="lg">
      <RotateCcw className="w-4 h-4 mr-2" />
      Play Again
    </Button>
    <Button variant="outline" onClick={onBack} size="lg" className="ml-4">
      <Home className="w-4 h-4 mr-2" />
      Back to Games
    </Button>
  </div>
);

export default GameCompletion;
