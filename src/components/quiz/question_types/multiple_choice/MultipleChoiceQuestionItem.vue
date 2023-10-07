<template>
  <div class="quiz">
    <div class="quiz-header"></div>

    <div class="question">
      <h3 class="instruction" v-html="id + 1 + '. ' + instruction"></h3>
      <h3><span v-html="questionText"> </span></h3>
    </div>

    <multiple-choice-choice-item
      v-for="(item, index) in choices"
      :key="index"
      :id="index"
      :text="item.choice_text"
      :item="item"
      :selectedOptions="selectedOptions"
      @selectOption="selectOption"
    ></multiple-choice-choice-item>
  </div>
</template>

<script>
import MultipleChoiceChoiceItem from "./MultipleChoiceChoiceItem";

export default {
  components: { MultipleChoiceChoiceItem },
  props: [
    "id",
    "text",
    "choices",
    "instruction",
    "question",
    "number_of_selections",
  ],
  data() {
    return {
      selectedOptions: this.question.answer_text
        ? this.question.answer_text
            .split(",")
            .map((item) => (parseInt(item) ? parseInt(item) : item))
        : [],
      questionText: this.text,
      originalQuestionText: this.text,
    };
  },
  methods: {
    selectOption(option) {
      if (this.number_of_selections > 1) {
        if (this.selectedOptions.includes(option)) {
          // Deselect it
          this.selectedOptions = this.selectedOptions
            .filter((o) => o !== option)
            .sort();
        } else {
          // Select it
          this.selectedOptions.push(option);
        }
      } else {
        this.selectedOptions = []
        this.selectedOptions.push(option);
      }

      this.$store
        .dispatch("questionStore/answerQuestion", {
          questionId: this.question.question_id,
          quizId: this.question.quiz_id,
          attemptId: this.question.attempt_id,
          answerText: this.selectedOptions.join(","),
        })
        .then((response) => {});
    },
  },
  created() {
    console.log(this.question.answer_text);
  },
};
</script>

<style scoped>
h1,
h3 {
  font-family: sans-serif;
}

h2 {
  font-size: 12pt;
  font-weight: 300;
  margin: 0;
  line-height: 0;
}

.quiz {
  width: 100%;
  height: auto;
  background-color: #eceeef;
  /* position: relative;
  top: 50%;
  left: 50%; */
  border-radius: 5px;
  /* transform: translate(25%, 0%); */
  -webkit-box-shadow: 0px 0px 47px 9px rgba(0, 0, 0, 0.08);
  -moz-box-shadow: 0px 0px 47px 9px rgba(0, 0, 0, 0.08);
  box-shadow: 0px 0px 47px 9px rgba(0, 0, 0, 0.08);
}
.quiz h1 {
  text-align: center;
}

.question {
  width: 100%;
  height: auto;
  background-color: #6356ca;
  white-space: initial;
  overflow: auto;
  color: #eee;
  /* text-overflow: ellipsis; */
}
.question h3 {
  padding-top: 16px;
  padding-left: 20px;
  font-size: 14pt;
}

.btn {
  border: 0;
  border-radius: 50px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  margin: 10px;
  padding: 12px 25px;
  letter-spacing: 1px;
  cursor: pointer;
}

.button-control {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #dddddd;
}

@media (max-width: 768px) {
  .quiz {
    width: 100%;
  }
}

.instruction {
  background-color: #6356ca;
  color: #eee;
}
</style>