import axios from "axios";
import API_LIST from "./API_LIST";

const questionStore = {
  namespaced: true,
  state() {
    return {
      questions: [],
      timer: { expired_time: null, time_left: null },
    };
  },
  mutations: {
    getQuestionList(state, payload) {
      state.questions = payload.questions;
      state.timer.expired_time = payload.expired_time;
      state.timer.time_left = payload.time_left;
    },
    answerQuestion(state, payload) {
      const question = state.questions.find(question => question.question_id === payload.questionId)
      question.answer_text = payload.answerText
    }
  },
  actions: {
    getQuestionList(context, payload) {
      return axios(API_LIST.getQuizById(payload.quizId))
        .then((response) => {
          if (!response.data.error) {
            const {
              expired_time,
              time_left,
              questions,
            } = response.data.response;
            payload.questions = questions;
            payload.expired_time = expired_time;
            payload.time_left = time_left;
            context.commit("getQuestionList", payload);
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
    },
    answerQuestion(context, payload) {
      return axios(API_LIST.answerQuestion(payload.questionId, payload))
        .then((response) => {
          if (!response.data.error) {
            // payload.question = response.data.question;
            context.commit("answerQuestion", payload);
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
    getQuestionList(state) {
      return state.questions;
    },
    getEditQuestion(state) {
      return state.editQuestion;
    },
    getTimer(state) {
      return state.timer
    }
  },
};

export default questionStore;
