<template>
  <div v-if="errorMessage" class="alert alert-danger mt-3">
    {{ errorMessage }}
  </div>
  <div v-else-if="successMessage" class="alert alert-success mt-3">
    {{ successMessage }}
  </div>
  <quizzes-list
    @setStatusMessages="setStatusMessages"
    @toggleShowQuizEditor="toggleShowQuizEditor"
  ></quizzes-list>
  <quiz-editor
    v-if="showQuizEditor"
    @setStatusMessages="setStatusMessages"
    @toggleShowQuizEditor="toggleShowQuizEditor"
    :mode="mode"
  ></quiz-editor>
</template>

<script>
import QuizzesList from "./manage_quizzes/QuizzesList.vue";
import QuizEditor from "./manage_quizzes/QuizEditor.vue";

export default {
  data() {
    return {
      showQuizEditor: false,
      mode: null,
      errorMessage: "",
      successMessage: "",
    };
  },
  components: { QuizzesList, QuizEditor },
  methods: {
    setStatusMessages(errorMessage = "", successMessage = "") {
      this.errorMessage = errorMessage;
      this.successMessage = successMessage;
    },
    toggleShowQuizEditor(data) {
      if (data.mode === "create") {
        this.mode = "create";

        if (data.action === "close") {
          this.showQuizEditor = false;
        } else {
          this.showQuizEditor = true;
        }
      } else if (data.mode === "edit") {
        if (data.action === "close") {
          this.showQuizEditor = false;
          return;
        }
        this.$store
          .dispatch("teacherStore/getQuizForEdit", { quizId: data.quizId })
          .then((response) => {
            this.mode = "edit";

            var container = document.querySelector("#quiz-editor-form");

            if (container) {
              container.scrollIntoView();
            }
            this.showQuizEditor = true;
          });
      } else if (data.mode === "delete") {
        if (
          this.showQuizEditor &&
          data.quizId ===
            this.$store.getters["teacherStore/getEditQuiz"].quiz_id
        ) {
          this.showQuizEditor = false;
        }
      }
    },
  },
};
</script>

<style scoped>
body {
  color: #eee;
  background-color: #25274d;
}
</style>