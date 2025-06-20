import STRINGS from "../../config/strings";

const validator = {
  validateEmail(email: string) {
    if (!email) return false;
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
  validatePassword(password: string) {
    if (!password) return false;
    if (password.length < 8) return false;
    return true;
  },
  validateProfilePictureId(id: number) {
    return id >= 1;
  },
  validateGender(gender: string) {
    return gender === "U" || gender === "M" || gender === "F";
  },
  validateRoleId(roleId: string) {
    return roleId === "1" || roleId === "2";
  },
  validateName(name: string) {
    return !!name;
  },
  validateNewPassword(current: string, newPassword: string) {
    if (!current || !newPassword) return false;
    if (current === newPassword) return false;
    return newPassword.length >= 8;
  },
  validateQuizId(quizId: number) {
    const regExp = /^\d+$/g;
    if (!quizId || regExp.test(regExp) || quizId < 0) return false;
    return true;
  },
  validateQuestionId(questionId: number) {
    if (!questionId || questionId < 0) return false;
    return true;
  },
  validateQuestionTypeId(questionId: number) {
    if (!questionId) return false;
    return questionId == 1 || questionId == 2 || questionId == 3;
  },
  validateQuestion(question: any) {
    return !!question;
  },
  validateQuestionItems(typeId: number, items: any) {
    if (!items) return false;
    if (typeId === 1) {
      return items.length >= 2;
    } else if (typeId === 2) {
      return items.length >= 1;
    } else if (typeId === 3) {
      return items.leftItems.length >= 2 && items.rightItems.length >= 2;
    }
    return true;
  },
  validateIsActiveQuestion(isActive: any) {
    if (isActive === undefined || isActive === null) return false;
    return isActive === true || isActive === false || isActive == 1 || isActive === 0;
  },
  validateTimeAllowed(timeAllowed: string) {
    if (!timeAllowed) return false;
    const timeAmount = parseInt(timeAllowed);
    return timeAmount >= 1;
  },
  validateRatingGiven(rating: number) {
    return rating === 1 || rating === 2 || rating === 3 || rating === 4 || rating === 5;
  },
  validateCourseName(courseName: string) {
    if (!courseName) return false;
    return courseName.length >= 3;
  },
};

export default validator;
