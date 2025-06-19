const { sendSuccess, sendFailure } = require("../../config/res");
const STRINGS = require("../../config/strings");
const VocabularyWordModel = require("../../models/vocabulary/VocabularyWordModel.ts").default;
const WordGroupModel = require("../../models/vocabulary/WordGroupModel.ts").default;
const UserVocabularyProgressModel = require("../../models/vocabulary/UserVocabularyProgressModel.ts").default;

module.exports = {
  getWords: async () => {
    try {
      const words = await VocabularyWordModel.findAll();
      return sendSuccess(words);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
  getGroups: async () => {
    try {
      const groups = await WordGroupModel.findAllWithWords();
      const formatted = groups.map((g) => ({
        id: g.GroupId,
        theme: g.Theme,
        description: g.Description,
        words: g.VocabularyWordGroup.map((v) => v.VocabularyWord.Word),
      }));
      return sendSuccess(formatted);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
  getUserProgress: async (userId) => {
    try {
      const progress = await UserVocabularyProgressModel.findByUser(userId);
      return sendSuccess(progress);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
  updateProgress: async ({ userId, wordId, mastery, memorized }) => {
    try {
      const data = {
        UserId: userId,
        WordId: wordId,
        Mastery: mastery,
        Memorized: memorized,
        Attempts: 1,
        CorrectStreak: mastery > 0 ? 1 : 0,
        LastReviewed: new Date()
      };
      await UserVocabularyProgressModel.upsert(userId, wordId, data);
      return sendSuccess(null);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
};
