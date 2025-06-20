import React from 'react';
import FlashcardMemoryGame from './index';

interface Props { onBack: () => void; }

const QuizMode: React.FC<Props> = (props) => (
  <FlashcardMemoryGame {...props} initialGameMode="quiz" />
);

export default QuizMode;
