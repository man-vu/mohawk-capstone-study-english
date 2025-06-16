import { defineStore } from 'pinia';
import axios from 'axios';
import API_LIST from './API_LIST';

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    isAuthenticated: !!localStorage.getItem('token'),
    isTeacher: localStorage.getItem('isTeacher') === 'true',
    authenticatedUser:
      localStorage.getItem('firstName') !== 'null'
        ? localStorage.getItem('firstName')
        : localStorage.getItem('email')
  }),
  getters: {
    isAuthenticatedState: (state) => state.isAuthenticated,
    isTeacherState: (state) => state.isTeacher,
    getAuthenticatedUser: (state) => state.authenticatedUser
  },
  actions: {
    async login(payload: { email: string; password: string }) {
      return axios(API_LIST.login(payload))
        .then((response) => {
          if (!response.data.error) {
            const { token, email, firstName, lastName, isTeacher, avatarUrl } =
              response.data.response;
            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);
            localStorage.setItem('isTeacher', isTeacher);
            localStorage.setItem('avatarUrl', avatarUrl);
            this.isAuthenticated = true;
            this.isTeacher = isTeacher;
            this.authenticatedUser = firstName !== 'null' ? firstName : email;
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return 'OK';
          }
          return response.data.error;
        })
        .catch((error) => {
          console.log(error);
          return 'ERROR';
        });
    },
    async register(payload: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
    }) {
      return axios(API_LIST.register(payload))
        .then((response) => {
          if (!response.data.error) {
            const { token, email, firstName, lastName, isTeacher, avatarUrl } =
              response.data.response;
            localStorage.setItem('token', token);
            localStorage.setItem('email', email);
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);
            localStorage.setItem('isTeacher', isTeacher);
            localStorage.setItem('avatarUrl', avatarUrl);
            this.isAuthenticated = true;
            this.isTeacher = isTeacher;
            this.authenticatedUser = firstName !== 'null' ? firstName : email;
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            return 'OK';
          }
          return response.data.error;
        })
        .catch((error) => {
          console.log(error);
          return 'ERROR';
        });
    },
    signOut() {
      localStorage.clear();
      this.isAuthenticated = false;
      this.isTeacher = false;
      this.authenticatedUser = null;
    },
    async forgotPassword(payload: { email: string }) {
      return axios(API_LIST.forgotPassword(payload))
        .then((response) => {
          console.log(response);
          return response.data.error || 'OK';
        })
        .catch((error) => {
          console.log(error);
          return 'ERROR';
        });
    }
  }
});

export default useAuthStore;
