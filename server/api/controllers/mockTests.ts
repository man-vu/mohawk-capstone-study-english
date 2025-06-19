const { sendSuccess, sendFailure } = require("../../config/res");
const STRINGS = require("../../config/strings");
const MockTestModel = require("../../models/MockTestModel.ts").default;

module.exports = {
  getTests: async () => {
    try {
      const tests = await MockTestModel.findAll();
      return sendSuccess(tests);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
  getTest: async (id) => {
    try {
      const test = await MockTestModel.findById(id);
      return sendSuccess(test);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
};
