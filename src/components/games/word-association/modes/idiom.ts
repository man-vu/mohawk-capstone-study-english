import type { WordGroup, WordItem, GameRound } from '../types';

const parseList = (val?: string | null): string[] =>
  val ? val.split(',').map(s => s.trim()).filter(Boolean) : [];

export const fetchIdiomGroups = async (apiUrl: string): Promise<WordGroup[]> => {
  const res = await fetch(`${apiUrl}lexicon/groups?type=idiom&limit=50`);
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

export const buildIdiomRound = (
  group: WordGroup,
  item: WordItem,
  roundNum: number,
  difficulty: 'easy' | 'medium' | 'hard',
  allMeanings: string[]
): GameRound => {
  const targetWord = item.text;
  const targetMeaning = item.meaning as string;
  const totalOptions = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 12 : 16;
  const availableDistractors = allMeanings.filter(m => m !== targetMeaning);
  const selectedDistractors = availableDistractors
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(totalOptions - 1, availableDistractors.length));
  const allOptions = [targetMeaning, ...selectedDistractors].sort(() => Math.random() - 0.5);

  return {
    id: `round-${roundNum}`,
    targetWord,
    targetMeaning,
    relatedWords: [targetMeaning],
    distractors: selectedDistractors,
    allOptions,
    theme: group.theme,
  };
};
