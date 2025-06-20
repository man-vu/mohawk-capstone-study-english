import { sendSuccess, sendFailure } from "../../config/res";
import STRINGS from "../../config/strings";
import LexiconModel from "../../models/lexicon/LexiconModel";
import LexiconGroupModel from "../../models/lexicon/LexiconGroupModel";
import UserLexiconProgressModel from "../../models/lexicon/UserLexiconProgressModel";

export default {
  getWords: async (type, limit, synAnt?: boolean) => {
    try {
      let words;
      if (synAnt) {
        words = await LexiconModel.findRandomWithSynAnt(limit ?? 50);
      } else {
        words = limit
          ? await LexiconModel.findRandom(limit, type)
          : await LexiconModel.findAll(type);
      }
      const formatted = words.map((w) => {
        // normalize results when using raw queries
        const typeName = w.LexiconType
          ? w.LexiconType.TypeName
          : (w as any).TypeName;
        const { TypeName, ...rest } = w;
        return { ...rest, LexiconType: typeName };
      });
      return sendSuccess(formatted);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
  getGroups: async (type, limit?: number) => {
    try {
      const groups = await LexiconGroupModel.findAllWithWords(type, limit);
      const formatted = groups.map((g) => ({
        id: g.GroupId,
        theme: g.Theme,
        description: g.Description,
        words: g.LexiconGroupMap.map((m) => ({
          expression: m.Lexicon.Word,
          meaning: m.Lexicon.Definition,
          synonyms: m.Lexicon.Synonyms,
          related: m.Lexicon.RelatedLexicon,
          guideword: m.Lexicon.Guideword,
          type: m.Lexicon.LexiconType.TypeName,
        })),
      }));
      return sendSuccess(formatted);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
  getUserProgress: async (userId) => {
    try {
      const progress = await UserLexiconProgressModel.findByUser(userId);
      return sendSuccess(progress);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
  updateProgress: async ({ userId, lexiconId, mastery, memorized }) => {
    try {
      const data = {
        UserId: userId,
        LexiconId: lexiconId,
        Mastery: mastery,
        Memorized: memorized,
        Attempts: 1,
        CorrectStreak: mastery > 0 ? 1 : 0,
        LastReviewed: new Date()
      };
      await UserLexiconProgressModel.upsert(userId, lexiconId, data);
      return sendSuccess(null);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
};
