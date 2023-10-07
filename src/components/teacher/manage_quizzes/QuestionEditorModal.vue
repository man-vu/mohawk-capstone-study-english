<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h2>Question Editor</h2>
            <h2 class="closeButton" @click="closeQuestionEditorModal()">X</h2>
          </div>

          <div class="modal-body">
            <div v-if="errorMessage" class="alert alert-danger mt-3">
              {{ errorMessage }}
            </div>
            <div class="question-editor-form">
              <div class="form-group">
                <label class="control-label" for="type">Type</label>
                <div>
                  <select
                    name="type"
                    class="col-4 form-control"
                    id="question-type"
                    v-model="question.type_id"
                    :disabled="mode === 'edit'"
                  >
                    <option
                      class="dropdown-item"
                      :value="type.type_id"
                      v-for="type in allQuestionTypes"
                      :key="type.type_id"
                    >
                      {{ type.type_name }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="control-label" for="instruction"
                  >Instruction</label
                >
                <div class="">
                  <textarea
                    name="instruction"
                    id="instruction"
                    rows="3"
                    placeholder="Choose the most suitable option to fill in the blank"
                    @change="instructionHasChanged = true"
                    v-model="question.instruction"
                  ></textarea>
                </div>
              </div>
              <div class="form-group">
                <div class="">
                  <div class="form-check form-check-inline">
                    <label class="form-check-label mr-2" for="active"
                      >Is active?</label
                    >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      name="active"
                      v-model="question.isActive"
                    />
                  </div>
                </div>
              </div>
              <multiple-choice-editor
                v-if="question.type_id === 1"
                :mode="mode"
                @handleSave="save"
              ></multiple-choice-editor>
              <gap-filling-editor
                v-else-if="question.type_id === 2"
                :mode="mode"
                @handleSave="save"
              ></gap-filling-editor>
              <matching-editor
                v-else-if="question.type_id === 3"
                :mode="mode"
                @handleSave="save"
              ></matching-editor>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import GapFillingEditor from "./question_editor/GapFillingEditor.vue";
import MatchingEditor from "./question_editor/MatchingEditor.vue";
import MultipleChoiceEditor from "./question_editor/MultipleChoiceEditor";

export default {
  provide() {
    return {
      setQuestionStatusMessages: this.setQuestionStatusMessages
    }
  },
  inject: [
    "openQuestionEditorModal",
    "closeQuestionEditorModal",
    "setStatusMessages",
  ],
  computed: {
    questionTypeId() {
      return this.question.type_id;
    },
  },
  props: ["mode", "quizId"],
  components: { MultipleChoiceEditor, GapFillingEditor, MatchingEditor },
  watch: {
    questionTypeId() {
      this.errorMessage = "";

      if (this.instructionHasChanged === false) {
        this.setDefaultInstruction();
      }
    },
  },
  data() {
    return {
      question: {
        type_id: 1,
        isActive: true,
        instruction:
          "",
        quizId: 0,
      },
      instructionHasChanged: false,
      allQuestionTypes: [],
      errorMessage: "",
    };
  },
  created() {
    if (this.mode === "edit") {
      this.question = this.$store.getters["teacherStore/getEditQuestion"];
      this.question.instruction = this.question.instruction
        .replaceAll("<br>", "\n")
        .replaceAll(`''`, `'`);
      this.instructionHasChanged = true;
    } else {
      const quiz = this.$store.getters["teacherStore/getEditQuiz"];
      this.question.quizId = quiz.quiz_id;
      this.setDefaultInstruction()
    }

    this.allQuestionTypes = this.$store.getters[
      "teacherStore/getAllQuestionTypes"
    ];

    console.log(this.question);
  },
  methods: {
    setQuestionStatusMessages(errorMessage = "", successMessage = "") {
      this.errorMessage = errorMessage;
      this.successMessage = successMessage;
    },
    setDefaultInstruction() {
      if (this.question.type_id === 1) {
        this.question.instruction = "Select the correct answer(s).";
      } else if (this.question.type_id === 2) {
        this.question.instruction = "Complete the text with one word that best fits into each gap.";
      } else if (this.question.type_id === 3) {
        this.question.instruction = "Complete the question by selecting an appropriate option for each text on the left column.";
      }
    },
    save(otherProps) {
      if (this.mode === "create") {
        this.$store
          .dispatch("teacherStore/createQuestion", {
            ...otherProps,
            instruction: this.question.instruction
              .replaceAll("\n", "<br>")
              .replaceAll("'", "''"),
            isActive: this.question.isActive,
            quizId: this.question.quizId,
          })
          .then((response) => {
            if (response === "OK") {
              this.closeQuestionEditorModal();
              this.setStatusMessages("", "A new question has been added.");
            } else {
              this.errorMessage = response;
            }
          });
      } else if (this.mode === "edit") {
        this.$store
          .dispatch("teacherStore/updateQuestion", {
            ...otherProps,
            questionId: this.question.question_id,
            instruction: this.question.instruction
              .replaceAll("\n", "<br>")
              .replaceAll("'", "''"),
            isActive: this.question.isActive,
          })
          .then((response) => {
            if (response === "OK") {
              this.closeQuestionEditorModal();
              this.setStatusMessages(
                "",
                `Question ${this.question.question_id} has been updated.`
              );
            } else {
              this.errorMessage = response;
            }
          });
      }
    },
  },
};
</script>

<style scoped>
#instruction {
  width: 100%;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(218, 210, 210, 0.5);
  display: grid;
  transition: opacity 0.3s ease;
  overflow: auto;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 55%;
  margin: 0px auto;
  background: #111;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header {
  background: #6356ca;
}

.modal-body {
  overflow-y: auto;
  background: #111;
  padding-left: 30px;
  padding-right: 30px;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

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
.question-editor-form label {
  font-weight: 600;
}
.question-editor-form button {
  color: #fff;
  font-weight: 600;
  width: 25%;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .modal-container {
    width: 95%;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .modal-container {
    width: 85%;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .modal-container {
    width: 75%;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
  .modal-container {
    width: 65%;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
  .modal-container {
    width: 55%;
  }
}

.closeButton {
  cursor: pointer;
}
</style>