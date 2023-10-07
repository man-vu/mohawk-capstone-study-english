<template>
  <div v-if="quiz" class="col-md-12">
    <h2>Selected Quiz: {{ quiz.quizId }}</h2>
    <div id="quiz-editor-form">
      <div v-if="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
      <div v-else-if="successMessage" class="alert alert-success mt-3">
        {{ successMessage }}
      </div>
      <div class="form-group">
        <label class="control-label col-sm-6" for="courseName"
          >Course Name:</label
        >
        <div class="col-sm-12">
          <input
            type="text"
            class="form-control"
            id="courseName"
            placeholder="Enter Course Name"
            name="courseName"
            v-model="quiz.courseName"
          />
        </div>
      </div>
      <div class="form-group">
        <label class="control-label col-sm-6" for="type">Description</label>
        <div class="form-row col-sm-12">
          <textarea
            name="description"
            class="form-control"
            id="description"
            placeholder="Add description for the quiz"
            rows="3"
            cols="80"
            v-model="quiz.description"
          ></textarea>
        </div>
      </div>
      <div class="form-group">
        <div class="ml-2 form-check form-check-inline">
          <label class="form-check-label mr-2" for="active">Is active?</label>
          <input
            class="form-check-input"
            type="checkbox"
            name="active"
            v-model="quiz.isActive"
          />
        </div>
      </div>
      <div class="form-group">
        <label class="control-label col-sm-6" for="email">Time allowed</label>
        <div class="form-row col-sm-12">
          <div class="form-row align-items-center">
            <div class="col-auto">
              <input
                type="number"
                class="form-control"
                id="timeAllowedInput"
                placeholder="30"
                v-model="quiz.timeAllowed"
              />
            </div>
            <div class="form-check">
              <label class="form-check-label"> minutes </label>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label class="control-label col-sm-6" for="type">Skill</label>
        <div class="form-row col-sm-12">
          <select
            name="type"
            class="col-4 form-control"
            id="question-type"
            v-model="quiz.skillId"
          >
            <option
              v-for="s in allSkills"
              :key="s.skill_id"
              class="dropdown-item"
              href="#"
              :value="s.skill_id"
            >
              {{ s.skill_description }}
            </option>
          </select>
        </div>
      </div>
      <questions-list
        @setStatusMessages="setStatusMessages"
        v-if="quiz.questions.length > 0"
      ></questions-list>
      <div class="mt-2 mb-2" v-else-if="mode !== 'create' && quiz.questions.length === 0">
        There is no question created for this quiz yet
      </div>
      <div v-else>
        You can create questions only when the quiz has been created.
      </div>
      <button
        :disabled="mode === 'create'"
        @click="openQuestionEditorModal(null, 'create')"
        class="mb-3 btn btn-primary"
      >
        Add Question
      </button>
      <div class="form-group">
        <button @click="cancel" type="button" class="btn btn-dark">
          Cancel
        </button>
        <button @click="handleSave" type="button" class="ml-3 btn btn-primary">
          Save
        </button>
      </div>
    </div>
  </div>
  <question-editor-modal
    v-if="showQuestionEditor"
    @close="openQuestionEditorModal"
    @setStatusMessages="setStatusMessages"
    :mode="questionEditorOpenMode"
    :quizId="quiz.quiz_id"
  ></question-editor-modal>
</template>

<script>
import QuestionEditorModal from "./QuestionEditorModal.vue";
import QuestionsList from "./QuestionsList.vue";
import CaseConverter from "js-convert-case";

export default {
  props: ["mode"],
  emits: ["toggleShowQuizEditor", "setStatusMessages"],
  provide() {
    return {
      openQuestionEditorModal: this.openQuestionEditorModal,
      closeQuestionEditorModal: this.closeQuestionEditorModal,
      setStatusMessages: this.setStatusMessages,
    };
  },
  components: { QuestionsList, QuestionEditorModal },
  computed: {
    editQuiz() {
      return this.$store.getters["teacherStore/getEditQuiz"];
    },
  },
  watch: {
    editQuiz() {
      if (this.mode === "edit") {
        const quiz = this.editQuiz;
        const convertedQuiz = CaseConverter.camelKeys(quiz);
        this.quiz = convertedQuiz;
        this.quiz.isActive = this.quiz.isActive === 1 ? true : false;
      }
    },
  },
  data() {
    return {
      quiz: {
        quizId: " New ",
        courseName: "",
        isActive: true,
        timeAllowed: 30,
        description: "",
        questions: [],
        skillId: 1,
      },
      allSkills: [],
      showQuestionEditor: false,
      questionEditorOpenMode: null,
      errorMessage: "",
      successMessage: "",
    };
  },
  mounted() {
    var container = document.querySelector("#quiz-editor-form");

    if (container) {
      container.scrollIntoView(true);
      document.getElementById("quiz-editor-form").scrollTop -= 100;
    }
  },
  methods: {
    setStatusMessages(errorMessage = "", successMessage = "") {
      this.errorMessage = errorMessage;
      this.successMessage = successMessage;
    },
    openQuestionEditorModal(questionId, mode) {
      this.questionEditorOpenMode = mode;

      if (mode === "edit") {
        this.$store
          .dispatch("teacherStore/getQuestionForEdit", { questionId })
          .then((response) => {
            this.showQuestionEditor = true;
          });
      } else {
        this.showQuestionEditor = true;
      }
    },
    closeQuestionEditorModal() {
      this.showQuestionEditor = false;
    },
    cancel() {
      this.$emit("toggleShowQuizEditor", { mode: this.mode, action: "close" });
    },
    handleSave() {
      this.setStatusMessages();

      if (this.mode === "create") {
        this.$store
          .dispatch("teacherStore/createQuiz", this.quiz)
          .then((response) => {
            if (response === "OK") {
              this.$emit(
                "setStatusMessages",
                "",
                `New quiz named ${this.quiz.description} has been created`
              );
              this.$emit("toggleShowQuizEditor", {
                mode: this.mode,
                action: "close",
              });
            } else {
              this.errorMessage = response;
            }
          });
      } else if (this.mode === "edit") {
        this.setStatusMessages();

        this.$store
          .dispatch("teacherStore/updateQuiz", this.quiz)
          .then((response) => {
            if (response === "OK") {
              this.$emit(
                "setStatusMessages",
                "",
                `Quiz ${this.quiz.quizId} has been updated`
              );
              this.$emit("toggleShowQuizEditor", {
                mode: this.mode,
                action: "close",
              });
            } else {
              this.errorMessage = response;
            }
          });
      }
    },
  },
  created() {
    if (this.mode === "edit") {
      const quiz = this.$store.getters["teacherStore/getEditQuiz"];
      const convertedQuiz = CaseConverter.camelKeys(quiz);
      this.quiz = convertedQuiz;
      this.quiz.isActive = this.quiz.isActive === 1 ? true : false;
    }

    this.allSkills = this.$store.getters["teacherStore/getAllSkills"];
  },
};
</script>

<style scoped>
.col-md-3 {
  background: #ff9b00;
  padding: 4%;
  border-top-left-radius: 0.5rem;
  border-bottom-left-radius: 0.5rem;
}
.col-md-9 {
  background: #fff;
  padding: 3%;
  border-top-right-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}
#quiz-editor-form label {
  font-weight: 600;
}
#quiz-editor-form button {
  color: #fff;
  font-weight: 600;
}
</style>