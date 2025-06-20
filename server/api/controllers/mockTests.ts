import { sendSuccess, sendFailure } from "../../config/res";
import STRINGS from "../../config/strings";
import MockTestModel from "../../models/mockTests/MockTestModel";

export default {
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
