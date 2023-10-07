import axios from "axios";
import API_LIST from "./API_LIST";

const authStore = {
  namespaced: true,
  state() {
    return {
      isAuthenticated: !!localStorage.getItem("token"),
      isTeacher: localStorage.getItem("isTeacher") === "true",
      authenticatedUser:
        localStorage.getItem("firstName") !== "null"
          ? localStorage.getItem("firstName")
          : localStorage.getItem("email"),
    };
  },
  mutations: {
    login(state, payload) {
      state.isAuthenticated = !!localStorage.getItem("token");
      state.isTeacher = localStorage.getItem("isTeacher") === "true";
      state.authenticatedUser =
        localStorage.getItem("firstName") !== "null"
          ? localStorage.getItem("firstName")
          : localStorage.getItem("email");
          axios.defaults.headers.common["Authorization"] = !!localStorage.getItem("token")
  ? `Bearer ${localStorage.getItem("token")}`
  : "";
    },
    register(state, payload) {},
    signOut(state, payload) {
      state.isAuthenticated = false;
      state.isTeacher = false;
      state.authenticatedUser = null;
      window.location.href = '/'
    },
  },
  actions: {
    login(context, payload) {
      return axios(API_LIST.login(payload))
        .then((response) => {
          if (!response.data.error) {
            const {
              token,
              email,
              firstName,
              lastName,
              isTeacher,
              avatarUrl
            } = response.data.response;

            

            localStorage.setItem("token", token);
            localStorage.setItem("email", email);
            localStorage.setItem("firstName", firstName);
            localStorage.setItem("lastName", lastName);
            localStorage.setItem("isTeacher", isTeacher);
            localStorage.setItem("avatarUrl", avatarUrl);
            return "OK";
          } else {
            return response.data.error;
          }
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
          context.commit("login", payload);
        });
    },
    register(context, payload) {
      return axios(API_LIST.register(payload))
        .then((response) => {
          if (!response.data.error) {
            const {
              token,
              email,
              firstName,
              lastName,
              isTeacher,
              avatarUrl
            } = response.data.response;

            localStorage.setItem("token", token);
            localStorage.setItem("email", email);
            localStorage.setItem("firstName", firstName);
            localStorage.setItem("lastName", lastName);
            localStorage.setItem("isTeacher", isTeacher);
            localStorage.setItem("avatarUrl", avatarUrl);

            return "OK";
          } else {
            return response.data.error;
          }
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
          context.commit("register", payload);
        });
    },
    signOut(context, payload) {
      
      localStorage.clear();
      context.commit("signOut", payload);
    },
    forgotPassword(context, payload) {
      return axios(API_LIST.forgotPassword(payload))
        .then((response) => {
          if (!response.data.error) {
          }

          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
  },
  getters: {
    isAuthenticated(state) {
      return state.isAuthenticated;
    },
    isTeacher(state) {
      return state.isTeacher;
    },
    getAuthenticatedUser(state) {
      
      return state.authenticatedUser;
    },
  },
};

export default authStore;
