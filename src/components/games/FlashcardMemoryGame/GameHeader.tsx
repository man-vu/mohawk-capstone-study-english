import React from "react";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import { Play, Pause, RotateCcw, Home, Shuffle, Clock, Target, Star } from "lucide-react";

const GameHeader = ({
  gameMode,
  timer,
  currentIndex,
  totalCards,
  score,
  isPaused,
  onPauseToggle,
  onShuffle,
  onReset,
  onBack,
}) => (
  <div>
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-6">
      {/* Left: Mode and Stats */}
      <div className="flex flex-wrap items-center gap-4">
        <span className="capitalize font-bold text-xl tracking-wide bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          {gameMode} Mode
        </span>
        <div className="flex items-center gap-3">
          {/* Clock Pill */}
          <span className="flex items-center gap-1 px-4 py-1 rounded-full bg-blue-900/50 shadow-inner border border-blue-600 animate-pulse-slow">
            <Clock className="w-5 h-5 text-blue-400 drop-shadow-md" />
            <span className="font-mono text-lg tracking-widest text-blue-200 drop-shadow-glow">{timer}</span>
          </span>
          {/* Card Index */}
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-700">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-purple-200">Card: {currentIndex}/{totalCards}</span>
          </span>
          {/* Score */}
          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-900/40 border border-yellow-600">
            <Star className="w-4 h-4 text-yellow-300" />
            <span className="font-semibold text-yellow-200">Score: {score}</span>
          </span>
        </div>
      </div>
      {/* Right: Controls */}
      <div className="flex gap-2">
        <Button onClick={onPauseToggle} variant="ghost" size="icon" className="rounded-full border border-blue-700/70 shadow">
          {isPaused ? <Play className="w-5 h-5 text-blue-400" /> : <Pause className="w-5 h-5 text-blue-400" />}
        </Button>
        <Button onClick={onShuffle} variant="ghost" size="icon" className="rounded-full border border-purple-700/70">
          <Shuffle className="w-5 h-5 text-purple-400" />
        </Button>
        <Button onClick={onReset} variant="ghost" size="icon" className="rounded-full border border-yellow-600/70">
          <RotateCcw className="w-5 h-5 text-yellow-300" />
        </Button>
        <Button onClick={onBack} variant="ghost" size="icon" className="rounded-full border border-gray-700/70">
          <Home className="w-5 h-5 text-gray-300" />
        </Button>
      </div>
    </div>
    <Progress value={(currentIndex / totalCards) * 100} className="w-full mb-6" />
  </div>
);

export default GameHeader;
