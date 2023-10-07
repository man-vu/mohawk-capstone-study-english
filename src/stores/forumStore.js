import axios from "axios";
import API_LIST from "./API_LIST";

const quizStore = {
  namespaced: true,
  state() {
    return {
      threads: [],
      quizzes: [],
      skills: [],
      users: [],
      currentThread: {},
    };
  },
  mutations: {
    getDataForDiscussion(state, payload) {
      state.threads = payload.threads;
      state.quizzes = payload.quizzes;
      state.skills = payload.skills;
      state.users = payload.users;
    },
    getDataForDiscussionThread(state, payload) {
      state.currentThread = payload.currentThread;
    },
    createThread(state, payload) {
      state.currentThread = payload.currentThread;
    },
    createPost(state, payload) {
      state.currentThread.posts.push(payload.post);
    },
    searchThreads(state, payload) {
      state.threads = payload
    }, 
    deletePost(state, payload) {
      const f = state.currentThread.posts.filter(p => p.post_id !== payload.post_id)
      state.currentThread.posts = f
    }
  },
  actions: {
    getDataForDiscussion(context, payload) {
      return axios(API_LIST.getDataForDiscussion)
        .then((response) => {
          if (!response.data.error) {
            payload = response.data.response;
            context.commit("getDataForDiscussion", payload);
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
    getDataForDiscussionThread(context, payload) {
      return axios(API_LIST.getDiscussionThreadById(payload.threadId))
        .then((response) => {
          if (!response.data.error) {
            let currentThread = response.data.response;
            payload.currentThread = currentThread;
            context.commit("getDataForDiscussionThread", payload);
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
    createThread(context, payload) {
      return axios(API_LIST.createThread(payload))
        .then((response) => {
          if (!response.data.error) {
            let newThreadId = response.data.response.newThreadId;
            payload.newThreadId = newThreadId;
            return { newThreadId };
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
    createPost(context, payload) {
      
      return axios(API_LIST.createPost(payload))
        .then((response) => {
          if (!response.data.error) {
            payload.post = response.data.response;
            context.commit("createPost", payload);
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
    searchThreads(context, payload) {
      return axios(API_LIST.searchThread(payload))
      .then((response) => {
        if (!response.data.error) {
          payload = response.data.response;
          context.commit("searchThreads", payload);
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
    deletePost(context, payload) {
      return axios(API_LIST.deletePost(payload.post_id))
      .then((response) => {
        if (!response.data.error) {
          context.commit("deletePost", payload);
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
    // getDataForDiscussion(state) {
    //   return {
    //     threads: state.threads,
    //     quizzes: state.quizzes,
    //     skills: state.skills,
    //   }
    // },
    getQuizzes(state) {
      return state.quizzes;
    },
    getSkills(state) {
      return state.skills;
    },
    getThreads(state) {
      return state.threads;
    },
    getUsers(state) {
      console.log(state.users);
      return state.users;
    },
    getCurrentThread(state) {
      return state.currentThread;
    },
    getEditQuiz(state) {
      return state.editQuiz;
    },
  },
};

export default quizStore;
