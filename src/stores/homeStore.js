import axios from "axios";
import API_LIST from "./API_LIST";

const quizStore = {
  namespaced: true,
  state() {
    return {
      quizzes: [],
      allSkills: [],
      allQuestionTypes: [],
      editQuiz: {},
      quizResult: {}
    };
  },
  mutations: {
    toggleFavorite(state, payload) {
      let quizId = payload.id;
      let quiz = state.quizzes.find((q) => q.quiz_id === quizId);

      quiz.favorite = quiz.favorite === 1 ? 0 : 1;

      state.quizzes = state.quizzes.filter(q => q.quiz_id > 0)
    },
    updateRating(state, payload) {
      let quizId = payload.id;
      let quiz = state.quizzes.find((q) => q.quiz_id === quizId);

      quiz.rating_given = payload.ratingGiven;
      quiz.rating_count = payload.rating_count;
      quiz.average_rating = payload.average_rating;
    },
    getDataForHome(state, payload) {
      state.quizzes = payload.quizzes;
    },
    submitQuiz(state, payload) {
      state.quizResult.attempt_id = payload.attempt_id
      state.quizResult.marked = payload.marked
      state.quizResult.quiz_id = payload.quiz_id 
      state.quizResult.accuracy = payload.accuracy 
    }
  },
  actions: {
    toggleFavorite(context, payload) {
      return axios(API_LIST.toggleFavorite(payload.id))
        .then((response) => {
          if (!response.data.error) {
            context.commit("toggleFavorite", payload);
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
    getDataForHome(context, payload) {
      return axios(API_LIST.getDataForHome)
        .then((response) => {
          const quizzes = response.data.response;
          
          if (!response.data.error) {
            context.commit("getDataForHome", { quizzes });
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
    updateRating(context, payload) {
      return axios(API_LIST.updateRating(payload.id, payload))
        .then((response) => {
          if (!response.data.error) {
            payload = {...payload, ...response.data.response}
            context.commit("updateRating", payload);
            return "OK"
          }

          return response.data.response
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    }
  },
  getters: {
    getQuizList(state) {
      return state.quizzes;
    },
    getEditQuiz(state) {
      return state.editQuiz;
    },
    getAllQuestionTypes(state) {
      return state.allQuestionTypes;
    },
    getAllSkills(state) {
      return state.allSkills;
    },
    getQuizResult(state) {
      return state.quizResult
    }
  },
};

export default quizStore;
