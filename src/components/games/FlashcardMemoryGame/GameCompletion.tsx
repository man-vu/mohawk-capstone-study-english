import React from "react";
import { Button } from "../../ui/button";
import { Trophy, RotateCcw, Home } from "lucide-react";

const GameCompletion = ({
  score,
  accuracy,
  memorizedCount,
  time,
  incorrectWords,
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
