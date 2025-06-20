export interface WordItem {
  text: string;
  meaning?: string;
  synonyms?: string | null;
  antonyms?: string | null;
  related?: string | null;
  guideword?: string | null;
}

export interface WordGroup {
  id: string;
  theme: string;
  words: WordItem[];
  description: string;
}

export type RelationType = 'synonym' | 'antonym';

export interface GameRound {
  id: string;
  targetWord: string;
  targetMeaning?: string;
  synonyms?: string[];
  antonyms?: string[];
  guidewords?: string[];
  relatedWords: string[];
  distractors: string[];
  allOptions: string[];
  theme: string;
  relationType?: RelationType;
}

export type GameMode = 'vocabulary' | 'idiom' | 'phrasal verb' | 'syn-ant';
