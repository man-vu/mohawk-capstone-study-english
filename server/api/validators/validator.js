const STRINGS = require("../../config/strings");

module.exports = {
  validateEmail: function(email) {
    if (!email) {
      return false;
    }

    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },
  validatePassword: function(password) {
    if (!password) {
      return false;
    }
    if (password.length < 8) {
      return false;
    }

    return true;
  },
  validateProfilePictureId: function(id) {
    if (id < 1) {
      return false;
    }
    return true;
  },
  validateGender: function(gender) {
    if (gender !== "U" && gender !== "M" && gender !== "F") {
      return false;
    }
    return true;
  },
  validateRoleId: function(roleId) {
    if (roleId !== "1" && roleId !== "2") {
      return false;
    }
    return true;
  },
  validateName: function(name) {
    if (name) {
      return true;
    } else {
      return false;
    }
  },
  validateNewPassword: function(current, newPassword) {
    if (!current || !newPassword) {
      return false;
    }

    if (current === newPassword) {
      return false;
    }

    if (newPassword.length < 8) {
      return false;
    }

    return true;
  },
  validateQuizId: function(quizId) {
    const regExp = /^\d+$/g;
    if (!quizId || regExp.test(regExp) || quizId < 0) {
      return false
    }

    return true;
  },
  validateQuestionId: function(questionId) {
    if (!questionId || questionId < 0) {
      return false
    }

    return true;
  },
  validateQuestionTypeId: function(questionId) {
    if (!questionId) {
      return false;
    } 

    if (questionId != 1 && questionId != 2 && questionId != 3) {
      return false
    }

    return true
  },
  validateQuestion: function(question) {
    if (!question) {
      return false
    }

    return true;
  },
  validateQuestionItems: function(typeId, items) {
    if (!items) {
      return false
    }

    if (typeId === 1) {
      if (items.length < 2) {
        return false
      }
    } else if (typeId === 2) {
      if (items.length < 1) {
        return false
      }
    } else if (typeId === 3) {
      if (items.leftItems.length < 2 || items.rightItems.length < 2) {
        return false
      } 
    }
    
    return true
  },
  validateIsActiveQuestion: function(isActive) {
    if (isActive === undefined || isActive === null) {
      return false
    } 

    if (isActive === true || isActive === false || isActive == 1 || isActive === 0) {
      return true
    }

    return false
  },
  validateTimeAllowed: function(timeAllowed) {
    if (!timeAllowed) {
      return false
    } 

    const timeAmount = parseInt(timeAllowed)

    if (timeAmount < 1) {
      return false
    }

    return true
  },
  validateRatingGiven: function(rating) {
    if (rating !== 1 && rating !== 2 && rating !== 3 && rating !== 4 && rating !== 5) {
      return false;
    }

    return true
  },
  validateCourseName: function(courseName) {
    if (!courseName) {
      return false;
    }
    if (courseName.length < 3) {
      return false;
    }

    return true;
  }
};
