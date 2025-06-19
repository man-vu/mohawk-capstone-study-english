const { sendSuccess, sendFailure } = require("../../config/res");
const STRINGS = require("../../config/strings");
const CourseModel = require("../../models/courses/CourseModel.ts").default;

module.exports = {
  getCourses: async () => {
    try {
      const courses = await CourseModel.findAll();
      return sendSuccess(courses);
    } catch (error) {
      console.log(error);
      return sendFailure(STRINGS.ERROR_OCCURRED);
    }
  },
};
