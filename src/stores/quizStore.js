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
    submitQuiz(state, payload) {
      state.quizResult = payload
    }
  },
  actions: {
    submitQuiz(context, payload) {
      return axios(API_LIST.submitQuiz(payload))
      .then((response) => {
        
        if (!response.data.error) {
          payload = response.data.response
          context.commit("submitQuiz", payload);
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
