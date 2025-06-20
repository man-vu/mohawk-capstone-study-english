import React from 'react';
import FlashcardMemoryGame from './index';

interface Props { onBack: () => void; }

const MemoryChallenge: React.FC<Props> = (props) => (
  <FlashcardMemoryGame {...props} initialGameMode="memory" />
);

export default MemoryChallenge;
