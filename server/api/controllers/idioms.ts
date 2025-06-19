const { sendSuccess, sendFailure } = require("../../config/res");
const STRINGS = require("../../config/strings");
const IdiomGroupModel = require("../../models/idioms/IdiomGroupModel.ts").default;

module.exports = {
  getGroups: async () => {
    try {
      const groups = await IdiomGroupModel.findAllWithIdioms();
      const formatted = groups.map((g) => ({
        id: g.GroupId,
        theme: g.Theme,
        description: g.Description,
        words: g.IdiomGroupMap.map((i) => i.Idiom.Expression),
      }));
      return sendSuccess(formatted);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
};
