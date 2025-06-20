import React from "react";
import { Button } from "../../ui/button";
import { Card, CardContent } from "../../ui/card";
import { Play, Home, Zap, Star, Brain, Target } from "lucide-react";

const wordTypes = [
  { id: "vocabulary", label: "Vocabulary" },
  { id: "idiom", label: "Idioms" },
  { id: "phrasal verb", label: "Phrasal Verbs" },
];

const gameModes = [
  { mode: "study", icon: Brain, title: "Study Mode", desc: "Review flashcards at your own pace" },
  { mode: "quiz", icon: Target, title: "Quiz Mode", desc: "Test your knowledge with immediate feedback" },
  { mode: "memory", icon: Zap, title: "Memory Challenge", desc: "Rapid-fire memory training" }
];

const difficulties = [
  { level: "easy", color: "green", desc: "Easy words" },
  { level: "medium", color: "yellow", desc: "Medium words" },
  { level: "hard", color: "red", desc: "Hard words" },
  { level: "mixed", color: "purple", desc: "All words" }
];

const GameSetup = ({
  lexiconType,
  setLexiconType,
  gameMode,
  setGameMode,
  selectedDifficulty,
  setSelectedDifficulty,
  onStart,
  onBack,
}) => (
  <div className="max-w-4xl mx-auto">
    <div className="text-center mb-8">
      <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <Zap className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Flashcard Memory Game
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        Master vocabulary, idioms, or phrasal verbs through interactive flashcards with spaced repetition and memory challenges.
      </p>
    </div>
    {/* Word Type Selection */}
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
        Choose Word Type
      </h3>
      <div className="flex justify-center gap-2">
        {wordTypes.map((t) => (
          <Button key={t.id} variant={lexiconType === t.id ? "default" : "outline"} onClick={() => setLexiconType(t.id)}>
            {t.label}
          </Button>
        ))}
      </div>
    </div>
    {/* Game Mode Selection */}
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
        Choose Game Mode
      </h3>
      <div className="grid md:grid-cols-3 gap-4">
        {gameModes.map(({ mode, icon: Icon, title, desc }) => (
          <Card key={mode}
            className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${
              gameMode === mode ? "ring-2 ring-purple-500" : ""
            }`}
            onClick={() => setGameMode(mode)}
          >
            <CardContent className="p-6 text-center">
              <Icon className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{title}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    {/* Difficulty Selection */}
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
        Choose Difficulty
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {difficulties.map(({ level, color, desc }) => (
          <Card
            key={level}
            className={`cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 ${
              selectedDifficulty === level ? "ring-2 ring-purple-500" : ""
            }`}
            onClick={() => setSelectedDifficulty(level)}
          >
            <CardContent className="p-4 text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 ${
                color === "green"
                  ? "bg-green-100 dark:bg-green-900/20"
                  : color === "yellow"
                  ? "bg-yellow-100 dark:bg-yellow-900/20"
                  : color === "red"
                  ? "bg-red-100 dark:bg-red-900/20"
                  : "bg-purple-100 dark:bg-purple-900/20"
              }`}>
                <Star className={`w-4 h-4 ${
                  color === "green"
                    ? "text-green-600 dark:text-green-400"
                    : color === "yellow"
                    ? "text-yellow-600 dark:text-yellow-400"
                    : color === "red"
                    ? "text-red-600 dark:text-red-400"
                    : "text-purple-600 dark:text-purple-400"
                }`} />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-1 capitalize">{level}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
    <div className="text-center space-y-4">
      <Button onClick={onStart} size="lg" className="px-8">
        <Play className="w-4 h-4 mr-2" />
        Start Flashcard Game
      </Button>
      <Button variant="outline" onClick={onBack}>
        <Home className="w-4 h-4 mr-2" />
        Back to Games
      </Button>
    </div>
  </div>
);

export default GameSetup;
