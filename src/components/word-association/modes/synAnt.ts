import type { WordGroup, WordItem, GameRound, RelationType } from '../types';

const parseList = (val?: string | null): string[] =>
  val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];

export const fetchSynAntGroups = async (apiUrl: string): Promise<WordGroup[]> => {
  const res = await fetch(`${apiUrl}lexicon/words?synAnt=true&limit=200`);
  const data = await res.json();
  if (data.response) {
    const words = data.response.map((w: any) => ({
      text: w.Word,
      meaning: w.Definition,
      synonyms: w.Synonyms,
      antonyms: w.Antonyms,
      guideword: w.Guideword,
      related: w.RelatedLexicon,
    }));
    return [
      {
        id: 'syn-ant',
        theme: 'Synonyms & Antonyms',
        words,
        description: '',
      },
    ];
  }
  return [];
};

export const buildSynAntRound = (
  group: WordGroup,
  item: WordItem,
  roundNum: number,
  distractors: string[],
  difficulty: 'easy' | 'medium' | 'hard'
): GameRound => {
  const targetWord = item.text;
  const synonyms = parseList(item.synonyms);
  const antonyms = parseList(item.antonyms);
  const useSynonyms = Math.random() < 0.5;
  const relationType: RelationType = useSynonyms ? 'synonym' : 'antonym';
  const relatedSet = useSynonyms ? synonyms : antonyms;
  const allRelated = [...synonyms, ...antonyms];

  const relatedWords = relatedSet
    .sort(() => Math.random() - 0.5)
    .slice(0, difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5);

  const numDistractors = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
  const exclude = [targetWord, ...allRelated];
  const selectedDistractors = distractors
    .filter(w => !exclude.some(ex => w.toLowerCase().includes(ex.toLowerCase())))
    .sort(() => Math.random() - 0.5)
    .slice(0, numDistractors);
  const allOptions = [...relatedWords, ...selectedDistractors].sort(() => Math.random() - 0.5);

  return {
    id: `round-${roundNum}`,
    targetWord,
    targetMeaning: item.meaning,
    synonyms,
    antonyms,
    relatedWords,
    distractors: selectedDistractors,
    allOptions,
    theme: group.theme,
    relationType,
  };
};
