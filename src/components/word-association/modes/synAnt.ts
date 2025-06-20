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
  const available: RelationType[] = [];
  if (synonyms.length > 0) available.push('synonym');
  if (antonyms.length > 0) available.push('antonym');
  const relationType: RelationType =
    available[Math.floor(Math.random() * available.length)];
  const relatedSet = relationType === 'synonym' ? synonyms : antonyms;
  const allRelated = [...synonyms, ...antonyms];

  const totalOptions = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16;
  const maxCorrect = Math.floor(totalOptions * 0.25);

  const relatedWords = relatedSet
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(maxCorrect, relatedSet.length));

  const numDistractors = totalOptions - relatedWords.length;
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
