const { sendSuccess, sendFailure } = require("../../config/res");
const STRINGS = require("../../config/strings");
const LexiconModel = require("../../models/lexicon/LexiconModel.ts").default;
const LexiconGroupModel = require("../../models/lexicon/LexiconGroupModel.ts").default;
const UserLexiconProgressModel = require("../../models/lexicon/UserLexiconProgressModel.ts").default;

module.exports = {
  getWords: async (type) => {
    try {
      const words = await LexiconModel.findAll(type);
      const formatted = words.map(w => ({
        ...w,
        LexiconType: w.LexiconType.TypeName,
      }));
      return sendSuccess(formatted);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
  getGroups: async (type) => {
    try {
      const groups = await LexiconGroupModel.findAllWithWords(type);
      const formatted = groups.map((g) => ({
        id: g.GroupId,
        theme: g.Theme,
        description: g.Description,
        words: g.LexiconGroupMap.map((m) => ({
          expression: m.Lexicon.Word,
          meaning: m.Lexicon.Definition,
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
