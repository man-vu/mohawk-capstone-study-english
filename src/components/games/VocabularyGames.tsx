import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import MatchingCardsGame from './MatchingCardsGame/index';
import WordAssociationGame from './WordAssociationGame';
import FlashcardMemoryGame from './FlashcardMemoryGame/FlashcardMemoryGame';
import { 
  Gamepad2, 
  Brain, 
  Zap, 
  Target,
  Trophy,
  Clock,
  Star,
  Play
} from 'lucide-react';

interface GameStats {
  gamesPlayed: number;
  averageScore: number;
  bestScore: number;
  totalTimeSpent: number;
}

interface Game {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedTime: number; // in minutes
  skillsFocused: string[];
  component: React.ComponentType<any>;
}

const VocabularyGames: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameStats] = useState<GameStats>({
    gamesPlayed: 12,
    averageScore: 85,
    bestScore: 98,
    totalTimeSpent: 45
  });

  const games: Game[] = [
    {
      id: 'matching-cards',
      title: 'Matching Cards',
      description: 'Match vocabulary words with their definitions in this memory-based card game',
      icon: Target,
      difficulty: 'Medium',
      estimatedTime: 5,
      skillsFocused: ['Memory', 'Vocabulary', 'Recognition'],
      component: MatchingCardsGame
    },
    {
      id: 'word-association',
      title: 'Word Association',
      description: 'Connect related words and build vocabulary networks through association',
      icon: Brain,
      difficulty: 'Hard',
      estimatedTime: 8,
      skillsFocused: ['Critical Thinking', 'Vocabulary', 'Connections'],
      component: WordAssociationGame
    },
    {
      id: 'flashcard-memory',
      title: 'Flashcard Memory',
      description: 'Interactive flashcard game with spaced repetition and memory challenges',
      icon: Zap,
      difficulty: 'Easy',
      estimatedTime: 3,
      skillsFocused: ['Memory', 'Recall', 'Repetition'],
      component: FlashcardMemoryGame
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const renderGameComponent = () => {
    const game = games.find(g => g.id === selectedGame);
    if (!game) return null;
    
    const GameComponent = game.component;
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <game.icon className="w-8 h-8 text-purple-500" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{game.title}</h2>
              <p className="text-gray-600 dark:text-gray-400">{game.description}</p>
            </div>
          </div>
          <Button 
            onClick={() => setSelectedGame(null)}
            variant="outline"
          >
            Back to Games
          </Button>
        </div>
        <GameComponent onBack={() => setSelectedGame(null)} />
      </div>
    );
  };

  if (selectedGame) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          {renderGameComponent()}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Vocabulary Games
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Learn vocabulary through fun and interactive memory games
          </p>
        </div>

        {/* Game Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Gamepad2 className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {gameStats.gamesPlayed}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Games Played
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {gameStats.averageScore}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Average Score
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="w-5 h-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {gameStats.bestScore}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Best Score
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {gameStats.totalTimeSpent}m
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Time Spent
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Game Selection */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {games.map((game) => {
            const IconComponent = game.icon;
            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer"
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{game.title}</CardTitle>
                          <Badge 
                            variant="outline" 
                            className={`mt-1 ${getDifficultyColor(game.difficulty)}`}
                          >
                            {game.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        ~{game.estimatedTime}min
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                      {game.description}
                    </p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Skills Practiced:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {game.skillsFocused.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => setSelectedGame(game.id)}
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play Game
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Game Benefits */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Why Play Vocabulary Games?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Improve Memory
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Strengthen your ability to remember and recall vocabulary through engaging gameplay
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Faster Recognition
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Develop quick word recognition skills essential for IELTS reading and listening
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                  Make Learning Fun
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Transform vocabulary learning from boring memorization into exciting challenges
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VocabularyGames;