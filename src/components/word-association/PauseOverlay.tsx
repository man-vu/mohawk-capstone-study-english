import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Play, Pause } from 'lucide-react';

interface PauseOverlayProps {
  isPaused: boolean;
  togglePause: () => void;
}

const PauseOverlay: React.FC<PauseOverlayProps> = ({ isPaused, togglePause }) => (
  <>
    {isPaused && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <Card>
          <CardContent className="p-8 text-center">
            <Pause className="w-12 h-24 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Game Paused</h3>
            <Button onClick={togglePause}>
              <Play className="w-4 h-4 mr-2" />
              Resume Game
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )}
  </>
);

export default PauseOverlay;
