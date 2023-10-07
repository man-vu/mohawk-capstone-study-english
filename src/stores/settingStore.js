import axios from "axios";
import API_LIST from "./API_LIST";

const settingStore = {
  namespaced: true,
  state() {
    return {
      user: {},
    };
  },
  mutations: {
    fetchUserInfo(state, payload) {
      state.user = payload.user;
      // localStorage.setItem("email", payload.email);
      // localStorage.setItem("firstName", payload.firstName);
      // localStorage.setItem("lastName", payload.lastName);
    },
    uploadAvatar(state, payload) {
      localStorage.setItem("avatarUrl", payload.savedFilename);
      window.location.href = "/settings"
    }
  },
  actions: {
    fetchUserInfo(context, payload) {
      return axios(API_LIST.getUserInfo)
        .then((response) => {
          if (!response.data.error) {
            payload.user = response.data.response;
            context.commit("fetchUserInfo", payload);
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
    saveUserInfo(context, payload) {
      return axios(API_LIST.saveUserInfo(payload))
        .then((response) => {
          if (!response.data.error) {
            return "OK"
          }

          return response.data.error
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    changePassword(context, payload) {
      return axios(API_LIST.changePassword(payload))
        .then((response) => {
          if (!response.data.error) {
            return "OK"
          }

          return response.data.error
        })
        .catch((error) => {
          console.log(error);
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    uploadAvatar(context, payload) {
      
      return axios(API_LIST.uploadAvatar(payload))
        .then((response) => {
          
          if (!response.data.error) {
            payload = response.data.response
            context.commit("uploadAvatar", payload);
            return response.data.response;
            
          }

          return response.data.error
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
    getUser(state) {
      return state.user;
    },
  },
};

export default settingStore;
