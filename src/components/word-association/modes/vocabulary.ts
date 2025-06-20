import type { WordGroup, WordItem, GameRound } from '../types';

const parseList = (val?: string | null): string[] =>
  val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];

export const fetchVocabularyGroups = async (apiUrl: string): Promise<WordGroup[]> => {
  const res = await fetch(`${apiUrl}lexicon/groups?type=vocabulary&limit=50`);
  const data = await res.json();
  if (data.response) {
    return data.response
      .map((g: any) => ({
        ...g,
        words: g.words.map((w: any) =>
          typeof w === 'string'
            ? { text: w }
            : {
                text: w.expression,
                meaning: w.meaning,
                synonyms: w.synonyms,
                antonyms: w.antonyms,
                related: w.related,
                guideword: w.guideword,
              }
        ),
      }))
      .filter((g: any) => g.words.length > 0);
  }
  return [];
};

export const buildVocabularyRound = (
  group: WordGroup,
  item: WordItem,
  roundNum: number,
  distractors: string[],
  difficulty: 'easy' | 'medium' | 'hard'
): GameRound => {
  const targetWord = item.text;
  const synonyms = parseList(item.synonyms);
  const related = parseList(item.related);
  const guidewords = parseList(item.guideword);

  let relatedSet = Array.from(new Set([...synonyms, ...related]));
  if (relatedSet.length === 0) {
    relatedSet = group.words.filter(w => w.text !== targetWord).map(w => w.text);
  }

  const totalOptions = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16;
  const maxCorrect = Math.floor(totalOptions * 0.25);

  const relatedWords = relatedSet
    .filter(w => w.toLowerCase() !== targetWord.toLowerCase())
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(maxCorrect, relatedSet.length));

  const numDistractors = totalOptions - relatedWords.length;
  const selectedDistractors = distractors
    .filter(w => w !== targetWord && !relatedSet.includes(w))
    .sort(() => Math.random() - 0.5)
    .slice(0, numDistractors);

  const allOptions = [...relatedWords, ...selectedDistractors].sort(() => Math.random() - 0.5);

  return {
    id: `round-${roundNum}`,
    targetWord,
    targetMeaning: item.meaning,
    synonyms,
    guidewords,
    relatedWords,
    distractors: selectedDistractors,
    allOptions,
    theme: group.theme,
  };
};
