import React from 'react';
import { Brain, Play, Home } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import type { GameMode } from './types';

interface SetupScreenProps {
  mode: GameMode;
  setMode: (mode: GameMode) => void;
  startGame: (level: 'easy' | 'medium' | 'hard') => void;
  noWordsAvailable: boolean;
  onBack: () => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({
  mode,
  setMode,
  startGame,
  noWordsAvailable,
  onBack,
}) => {
  const getInfo = (level: 'easy' | 'medium' | 'hard') => {
    const seconds = level === 'easy' ? 45 : level === 'medium' ? 30 : 20;
    const options = level === 'easy' ? 8 : level === 'medium' ? 12 : 16;
    if (mode === 'vocabulary') {
      return `${seconds}s per round • ${options} words to choose from`;
    }
    if (mode === 'syn-ant') {
      return `${seconds}s per round • ${options} synonym/antonym options`;
    }
    return `${seconds}s per round • ${options} meanings to choose from`;
  };
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Brain className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Word Association Game</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {mode === 'vocabulary'
            ? 'Find words related to the target word. Test your vocabulary knowledge and word connections!'
            : mode === 'idiom'
            ? 'Select the correct meaning for the displayed idiom.'
            : mode === 'phrasal verb'
            ? 'Select the correct meaning for the displayed phrasal verb.'
            : (
                <>Choose words that are <span className="font-bold text-green-600">synonyms</span> or <span className="font-bold text-red-600">antonyms</span> of the target word.</>
              )}
        </p>
      </div>
      <div className="flex justify-center gap-2 mb-6">
        {[
          { id: 'vocabulary', label: 'Vocabulary' },
          { id: 'idiom', label: 'Idioms' },
          { id: 'phrasal verb', label: 'Phrasal Verbs' },
          { id: 'syn-ant', label: 'Synonyms & Antonyms' },
        ].map((m) => (
          <Button key={m.id} variant={mode === m.id ? 'default' : 'outline'} onClick={() => setMode(m.id as GameMode)}>
            {m.label}
          </Button>
        ))}
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {(['easy', 'medium', 'hard'] as const).map((level) => (
          <Card
            key={level}
            className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
            onClick={() => startGame(level)}
          >
            <CardContent className="p-6 text-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                  level === 'easy'
                    ? 'bg-green-100 dark:bg-green-900/20'
                    : level === 'medium'
                    ? 'bg-yellow-100 dark:bg-yellow-900/20'
                    : 'bg-red-100 dark:bg-red-900/20'
                }`}
              >
                <Brain
                  className={`w-6 h-6 ${
                    level === 'easy'
                      ? 'text-green-600 dark:text-green-400'
                      : level === 'medium'
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                />
              </div>
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2 capitalize">{level}</h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {getInfo(level)}
              </div>
              <Button className="w-full" disabled={noWordsAvailable}>
                <Play className="w-4 h-4 mr-2" />
                Start Game
              </Button>
            </CardContent>
          </Card>
        ))}
        {noWordsAvailable && (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400">
            No words available for this mode.
          </div>
        )}
      </div>
      <div className="text-center">
        <Button variant="outline" onClick={onBack}>
          <Home className="w-4 h-4 mr-2" />
          Back to Games
        </Button>
      </div>
    </div>
  );
};

export default SetupScreen;
