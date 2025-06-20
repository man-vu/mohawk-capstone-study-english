import React from 'react';
import MatchingCardsGame from './index';

interface Props {
  onBack: () => void;
}

const MatchingCardsVocabulary: React.FC<Props> = (props) => (
  <MatchingCardsGame {...props} initialLexiconType="vocabulary" />
);

export default MatchingCardsVocabulary;
