<template>
  <div class="bg-purple" id="sidebar-wrapper" v-if="!isLoading">
    <div class="sidebar-heading">
      <strong v-if="currentQuiz">Active Quizzes</strong>
      <strong v-else>Select a Quiz</strong>
      </div>
    <div class="list-group list-group-flush">
      <a
        v-for="quiz in quizzes"
        :key="quiz.quiz_id"
        @click="navigateToQuiz(quiz.quiz_id)"
        href="#"
        class="list-group-item list-group-item-action"
        :class="selected(quiz.quiz_id)"
        >Quiz {{ quiz.quiz_id }} -         <span class="badge badge-pill" :class="badgeClass(quiz.skill_id)">{{
          quiz.skill_description
        }}</span> - {{ quiz.description }} <b v-if="currentQuiz == quiz.quiz_id || quiz.latestAttempt">- In progress</b>

      </a>
    </div>
  </div>
  <div v-else>
    <h1>Loading data...</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      originalQuizzes: [],
      quizzes: [],
      currentQuiz: null,
      isLoading: true,
    };
  },
  created() {
    const quizId = this.$route.params.id;

    if (quizId) {
      this.currentQuiz = quizId;
    }

    this.$store.dispatch("homeStore/getDataForHome").then((response) => {
      this.originalQuizzes = this.$store.getters["homeStore/getQuizList"];
      this.originalQuizzes = this.originalQuizzes.filter(
        (q) => q.number_of_questions > 0
      );
      this.quizzes = this.originalQuizzes;
      console.log(this.quizzes, "similar quiz");

      debugger

      this.isLoading = false;
    });
  },
  methods: {
    navigateToQuiz(quizId) {
      this.$router.push({
        name: "quizzes.index",
        params: { id: quizId },
      });
      window.location.href = `/quiz/${quizId}`;
    },
    selected(quizId) {
      return { selected: quizId == this.currentQuiz };
    },
    badgeClass(skillId) {
      const badges = {
        1: "secondary",
        2: "primary",
        3: "success",
        4: "danger",
        5: "warning",
        6: "info",
      };

      

      return `badge-${badges[skillId]}`;
    },
  },
};
</script>

<style scoped>
#wrapper {
  overflow-x: hidden;
}

.bg-purple {
  background-color: #5d51bd;
}

.bg-purple-cover:hover {
  background-color: #6355ce;
}

.list-group-item {
  background-color: #5d51bd;
  color: #eee;
}

.list-group-item:hover {
  background-color: #6355ce;
  color: #eee;
}

.selected {
  color: #6355ce;
  background-color: #eee;
}

#sidebar-wrapper {
  min-height: 100vh;
  margin-left: -15rem;
  -webkit-transition: margin 0.25s ease-out;
  -moz-transition: margin 0.25s ease-out;
  -o-transition: margin 0.25s ease-out;
  transition: margin 0.25s ease-out;
}

#sidebar-wrapper {
  padding: 0.875rem 1.25rem;
  font-size: 1.2rem;
}

.sidebar-heading {
  padding-left: 0.5rem;
  padding: 0.875rem 1.25rem;
  font-size: 1.2rem;
  background: #5d51bd;
}

#sidebar-wrapper .list-group {
  width: 15rem;
}

#page-content-wrapper {
  min-width: 100vw;
}

#wrapper.toggled #sidebar-wrapper {
  margin-left: 0;
}

@media (min-width: 768px) {
  #sidebar-wrapper {
    margin-left: 0;
  }

  #page-content-wrapper {
    min-width: 0;
    width: 100%;
  }

  #wrapper.toggled #sidebar-wrapper {
    margin-left: -15rem;
  }
}

#sidebar .sidebar-heading {
  padding: 20px;
  background: #5d51bd;
}
</style>