import axios from "axios";
import API_LIST from "./API_LIST";

const teacherStore = {
  namespaced: true,
  state() {
    return {
      quizzes: [],
      students: [],
      allSkills: [],
      allQuestionTypes: [],
      editQuiz: {},
      quizResult: {},
      questions: [],
      editQuestion: {},
      newQuestions: [],
      updatedQuestions: [],
      statistics: {},
    };
  },
  mutations: {
    getDataForTeacher(state, payload) {
      state.quizzes = payload.quizzes;
      state.allSkills = payload.allSkills;
      state.allQuestionTypes = payload.allQuestionTypes;
    },
    getQuizForEdit(state, payload) {
      state.editQuiz = state.quizzes.find((q) => q.quiz_id === payload.quizId);
      state.editQuiz.questions = payload.questions;
    },
    createQuiz(state, payload) {
      state.quizzes.push(payload.quiz);
      
      state.quizzes = state.quizzes.filter((q) => q.quiz_id > 0);
    },
    updateQuiz(state, payload) {
      let quiz = state.quizzes.find((q) => q.quiz_id === payload.quiz.quiz_id);
      quiz.course_name = payload.courseName;
      quiz.description = payload.description;
      quiz.is_active = payload.isActive === true ? 1 : 0;
      quiz.time_allowed = payload.timeAllowed;
      quiz.skill_id = payload.skillId;
    },
    resetRating(state, payload) {
      const quiz = state.quizzes.find((q) => q.quiz_id === payload.quizId);
      quiz.average_rating = 0
      quiz.rating_count = 0
    },
    deleteQuiz(state, payload) {
      state.quizzes = state.quizzes.filter((q) => q.quiz_id !== payload.quizId);
    },
    getQuestionForEdit(state, payload) {
      state.editQuestion = payload.question;
    },
    createQuestion(state, payload) {
      const typeNames = {
        1: "Multiple Choice",
        2: "Gap Filling",
        3: "Matching"
      }

      let newQuestion = {
        question_id: payload.question_id,
        type_id: payload.typeId,
        type_name: payload.type_name ? payload.type_name : (typeNames[payload.typeId]),
        items: payload.items,
        question: payload.question,
        instruction: payload.instruction,
        paragraph_title: payload.paragraphTitle,
        is_active: payload.isActive,
        correctAnswer: payload.correctAnswers,
      };
      state.editQuiz.questions.push(newQuestion)
      state.editQuiz.questions = state.editQuiz.questions.filter((q) => q.question_id > 0);
    },
    updateQuestion(state, payload) {
      const question = state.editQuiz.questions.find(q => q.question_id === payload.questionId)
      question.type_id = payload.typeId
      question.items = payload.items
      question.question = payload.question
      question.instruction = payload.instruction
      question.paragraph_title = payload.paragraphTitle
      question.is_active = payload.isActive
      question.correctAnswer = payload.correctAnswers
    },
    deleteQuestion(state, payload) {
      state.editQuiz.questions = state.editQuiz.questions.filter(
        (q) => q.question_id !== payload.questionId
      );
    },
    getBoardStatisticsByQuiz(state, payload) {
      state.statistics.quizStatistics = payload.quizStatistics;
    },
    getBoardStatisticsByStudent(state, payload) {
      state.statistics.studentsStatistics = payload;
    },
    getAllStudents(state, payload) {
      state.students = payload.students;
    },
  },
  actions: {
    getDataForTeacher(context, payload = {}) {
      return axios(API_LIST.getDataForTeacher)
        .then((response) => {
          if (!response.data.error) {
            payload = response.data.response;
            context.commit("getDataForTeacher", payload);
          }

          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getQuizForEdit(context, payload) {
      const quizId = payload.quizId;

      return axios(API_LIST.getQuizForEdit(quizId))
        .then((response) => {
          if (!response.data.error) {
            const questions = response.data.response;
            payload.questions = questions;
            context.commit("getQuizForEdit", payload);
          }

          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    createQuiz(context, payload) {
      return axios(API_LIST.createQuiz(payload))
        .then((response) => {
          if (!response.data.error) {
            payload.quiz = response.data.response;
            context.commit("createQuiz", payload);
            return "OK"
          }

          return response.data.error;
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    updateQuiz(context, payload) {
      return axios(API_LIST.saveQuizById(payload.quizId, payload))
        .then((response) => {
          if (!response.data.error) {
            payload.quiz = response.data.response;
            context.commit("updateQuiz", payload);
            return "OK"
          }

          return response.data.error;
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    deleteQuiz(context, payload) {
      return axios(API_LIST.deleteQuiz(payload.quizId))
        .then((response) => {
          if (!response.data.error) {
            context.commit("deleteQuiz", payload);
            return "OK";
          }

          return response.data.error;
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getQuestionForEdit(context, payload) {
      return axios(API_LIST.getQuestionForEdit(payload.questionId))
        .then((response) => {
          if (!response.data.error) {
            let question = response.data.response;

            payload.question = question;
            context.commit("getQuestionForEdit", payload);
          }

          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    createQuestion(context, payload) {
      return axios(API_LIST.createQuestion(payload))
        .then((response) => {
          if (!response.data.error) {
            
            payload.question_id = response.data.response.question_id;
            context.commit("createQuestion", payload);
            return "OK";
          }

          return response.data.error;
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    updateQuestion(context, payload) {
      return axios(API_LIST.updateQuestion(payload.questionId, payload))
        .then((response) => {
          if (!response.data.error) {
            context.commit("updateQuestion", payload);
            return "OK";
          }

          return response.data.error;
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    deleteQuestion(context, payload) {
      return axios(API_LIST.deleteQuestion(payload.questionId))
        .then((response) => {
          if (!response.data.error) {
            context.commit("deleteQuestion", payload);
            return "OK";
          }

          return response.data.error;
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getBoardStatisticsByQuiz(context, payload) {
      return axios(API_LIST.getBoardStatisticsByQuiz(payload.quizId, payload))
        .then((response) => {
          if (!response.data.error) {
            payload.quizStatistics = response.data.response;
            context.commit("getBoardStatisticsByQuiz", payload);
          }

          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getBoardStatisticsByStudent(context, payload) {
      return axios(
        API_LIST.getBoardStatisticsByStudent(payload.userId, payload)
      )
        .then((response) => {
          if (!response.data.error) {
            context.commit("getBoardStatisticsByStudent", {
              quizStatistics: response.data.response.quizStatistics,
              answerStatistics: response.data.response.answerStatistics,
            });
          }

          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getAllStudents(context, payload = {}) {
      console.log(API_LIST.getAllStudents);
      return axios(API_LIST.getAllStudents)
        .then((response) => {
          if (!response.data.error) {
            payload.students = response.data.response;
            context.commit("getAllStudents", payload);
          }

          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    resetRating(context, payload) {
      return axios(API_LIST.resetRating(payload.quizId))
        .then((response) => {
          if (!response.data.error) {
            context.commit("resetRating", payload);
            return "OK";
          }

          return response.data.response;
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
  getters: {
    getQuizList(state) {
      return state.quizzes;
    },
    getEditQuiz(state) {
      return state.editQuiz;
    },
    getEditQuestions(state) {
      if (state.editQuiz) {
        return state.editQuiz.questions
      } else {
        return null
      }
    },
    getAllQuestionTypes(state) {
      return state.allQuestionTypes;
    },
    getAllSkills(state) {
      return state.allSkills;
    },
    getQuizResult(state) {
      return state.quizResult;
    },
    getQuestionList(state) {
      return state.questions;
    },
    getEditQuestion(state) {
      return state.editQuestion;
    },
    getBoardStatisticsByQuiz(state) {
      return state.statistics.quizStatistics;
    },
    getBoardStatisticsByStudent(state) {
      return state.statistics.studentsStatistics;
    },
    getAllStudents(state) {
      return state.students;
    },
  },
};

export default teacherStore;
