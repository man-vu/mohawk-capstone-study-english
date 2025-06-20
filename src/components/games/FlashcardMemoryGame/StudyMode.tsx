import React from 'react';
import FlashcardMemoryGame from './index';

interface Props { onBack: () => void; }

const StudyMode: React.FC<Props> = (props) => (
  <FlashcardMemoryGame {...props} initialGameMode="study" />
);

export default StudyMode;
