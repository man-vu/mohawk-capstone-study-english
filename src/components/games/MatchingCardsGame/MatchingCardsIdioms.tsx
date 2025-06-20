import React from 'react';
import MatchingCardsGame from './index';

interface Props {
  onBack: () => void;
}

const MatchingCardsIdioms: React.FC<Props> = (props) => (
  <MatchingCardsGame {...props} initialLexiconType="idiom" />
);

export default MatchingCardsIdioms;
