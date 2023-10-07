// StAuth10065: I, Man Vu, 000801665 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.

import { createStore } from "vuex";
import authStore from "../stores/authStore";
import homeStore from "../stores/homeStore";
import quizStore from "../stores/quizStore";
import questionStore from "../stores/questionStore";
import forumStore from "../stores/forumStore";
import statisticsStore from "../stores/statisticsStore";
import settingStore from "../stores/settingStore";
import teacherStore from "../stores/teacherStore";

// Main Vuex store that puts all stores together
const store = createStore({
  modules: {
    authStore,
    homeStore,
    quizStore,
    questionStore,
    forumStore,
    statisticsStore,
    settingStore,
    teacherStore
  },
});

export default store;
