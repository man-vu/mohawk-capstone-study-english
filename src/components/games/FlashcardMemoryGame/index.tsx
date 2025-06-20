import React, { useState } from 'react';
import StudyMode from './StudyMode';
import QuizMode from './QuizMode';
import MemoryChallenge from './MemoryChallenge';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { Brain, Target, Zap, Home } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const FlashcardMemoryGame: React.FC<Props> = ({ onBack }) => {
  const [mode, setMode] = useState<'menu' | 'study' | 'quiz' | 'memory'>('menu');

  if (mode === 'study') return <StudyMode onBack={() => setMode('menu')} />;
  if (mode === 'quiz') return <QuizMode onBack={() => setMode('menu')} />;
  if (mode === 'memory') return <MemoryChallenge onBack={() => setMode('menu')} />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-center">Flashcard Memory Game</h2>
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="cursor-pointer" onClick={() => setMode('study')}>
          <CardContent className="p-6 text-center space-y-2">
            <Brain className="w-8 h-8 mx-auto text-purple-600" />
            <div className="font-semibold">Study Mode</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => setMode('quiz')}>
          <CardContent className="p-6 text-center space-y-2">
            <Target className="w-8 h-8 mx-auto text-purple-600" />
            <div className="font-semibold">Quiz Mode</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => setMode('memory')}>
          <CardContent className="p-6 text-center space-y-2">
            <Zap className="w-8 h-8 mx-auto text-purple-600" />
            <div className="font-semibold">Memory Challenge</div>
          </CardContent>
        </Card>
      </div>
      <div className="text-center">
        <Button variant="outline" onClick={onBack}>
          <Home className="w-4 h-4 mr-2" /> Back to Games
        </Button>
      </div>
    </div>
  );
};

export default FlashcardMemoryGame;
