import React from 'react';
import MatchingCardsGame from './index';

interface Props {
  onBack: () => void;
}

const MatchingCardsPhrasalVerbs: React.FC<Props> = (props) => (
  <MatchingCardsGame {...props} initialLexiconType="phrasal verb" />
);

export default MatchingCardsPhrasalVerbs;
