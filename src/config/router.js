import { createRouter, createWebHistory } from "vue-router";
import NotFound from "../components/nav/NotFound.vue";
import Home from "../components/home/Home";
import LoginPage from "../components/auth/LoginPage";
import ForgotPassword from "../components/auth/ForgotPassword";
import LogoutPage from "../components/auth/LogoutPage";
import RegisterPage from "../components/auth/RegisterPage";
import QuizPage from "../components/quiz/QuizPage";
import QuizResult from "../components/quiz/QuizResult";
import TeacherPage from "../components/teacher/TeacherPage";
import StudentStatistics from "../components/statistics/StudentStatistics";
import AccountSettings from "../components/settings/AccountSettings";

// This file defines all routes in this application using Vue Router
const router = createRouter({
  mode: "history",
  history: createWebHistory(),
  routes: [
    { path: "/", redirect: "/home" },
    { path: "/home", name: "home", component: Home, meta: {
      title: "Home Page"
    } },
    {
      path: "/login",
      name: "login",
      component: LoginPage,
      meta: {
        title: "Login",
        guest: true,
      },
    },
    {
      path: "/forgotPassword",
      name: "forgotPassword",
      component: ForgotPassword,
      meta: {
        title: "Forgot Password",
        guest: true,
      },
    },
    { path: "/logout", name: "logout", component: LogoutPage },
    {
      path: "/register",
      name: "register",
      component: RegisterPage,
      meta: {
        title: "Sign up",
        guest: true,
      },
    },
    {
      path: "/quiz",
      name: "quizzes",
      component: QuizPage,
      meta: {
        title: "Select A Quiz",
        requiresAuth: true,
      },
    },
    {
      path: "/quiz/:id",
      name: "quizzes.index",
      component: QuizPage,
      meta: {
        title: "Start Quiz",
        requiresAuth: true,
      },
    },
    {
      path: "/quiz-result",
      name: "quiz-result",
      component: QuizResult,
      meta: {
        title: "Result",
        requiresAuth: true,
      },
    },
    {
      path: "/statistics",
      name: "statistics",
      component: StudentStatistics,
      meta: {
        title: "Statistics",
        requiresAuth: true,
      },
    },
    {
      path: "/teacher",
      name: "teacher",
      component: TeacherPage,
      meta: {
        title: "Management Console",
        requiresAuth: true,
        isTeacher: true,
      },
    },
    {
      path: "/settings",
      name: "settings",
      component: AccountSettings,
      meta: {
        title: "Account Settings",
        requiresAuth: true,
      },
    },
    { path: "/:notFound(.*)", component: NotFound },
  ],
  linkActiveClass: "active",
  scrollBehavior(_, _2, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { left: 0, top: 0 };
  },
});

router.beforeEach((to, from, next) => {
  
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (localStorage.getItem("token") == null) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath },
      });
    } else {
      let isTeacher = JSON.parse(localStorage.getItem("isTeacher"));
      if (to.matched.some((record) => record.meta.isTeacher)) {
        if (isTeacher === true) {
          next();
        } else {
          next({ name: "home" });
        }
      } else {
        next();
      }
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (localStorage.getItem("token") == null) {
      next();
    } else {
      next({ name: "home" });
    }
  } else {
    next();
  }
});

export default router;
