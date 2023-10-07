import axios from "axios";
import API_LIST from "./API_LIST";

const quizStore = {
  namespaced: true,
  state() {
    return {
      quizStatistics: null,
      answerStatistics: null,
    };
  },
  mutations: {
    loadData(state, payload) {
      
      state.quizStatistics = payload.quizStatistics
      state.answerStatistics = payload.answerStatistics
    },
  },
  actions: {
    loadData(context, payload) {
      return axios(API_LIST.getStatistics)
        .then((response) => {
          if (!response.data.error) {
            context.commit("loadData", {
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
  },
  getters: {
    getStatistics(state) {
      return {
        quizStatistics: state.quizStatistics,
        answerStatistics: state.answerStatistics,
      };
    },
  },
};

export default quizStore;
