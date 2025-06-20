import { sendSuccess, sendFailure } from "../../config/res";
import STRINGS from "../../config/strings";
import CourseModel from "../../models/courses/CourseModel";

export default {
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
