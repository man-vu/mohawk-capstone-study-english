const { sendSuccess, sendFailure } = require("../../config/res");
const STRINGS = require("../../config/strings");
const PhrasalVerbGroupModel = require("../../models/phrasalVerbs/PhrasalVerbGroupModel.ts").default;

module.exports = {
  getGroups: async () => {
    try {
      const groups = await PhrasalVerbGroupModel.findAllWithVerbs();
      const formatted = groups.map((g) => ({
        id: g.GroupId,
        theme: g.Theme,
        description: g.Description,
        words: g.PhrasalVerbGroupMap.map((p) => ({
          expression: p.PhrasalVerb.Verb,
          meaning: p.PhrasalVerb.Meaning,
        })),
      }));
      return sendSuccess(formatted);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
};
