<template>
  <div class="mt-5 mb-5 row">
    <div class="col-1 col-sm-1 col-md-2 col-lg-3 col-xl-3"></div>
    <div class="col-10 col-sm-10 col-md-8 col-lg-6 col-xl-6">
      <div class="quiz-result">
        <div class="header-title quiz-result-header ">
          <h3 class="text-center"><font-awesome-icon
      class="ml-1"
      :icon="faCheckCircle"
      :style="{ color: 'green' }"
    ></font-awesome-icon> Your submission has been marked</h3>
        </div>
        <div class="quiz-result-header">
          <div class="left-column">
            <h6>Time spent: {{ displayTimeTaken }}</h6>
            <h6>Result: {{ result.result.correct + result.result.partial * 0.5}}/{{ result.result.total}}</h6>
          </div>
          <div class="right-column">
            <h6>Accuracy: {{ result.accuracy }}%</h6>
            <h6>Quiz: {{ result.quiz_id }}</h6>
          </div>
        </div>
        <div class="detailed-result">
          <table>
            <tbody>
              <quiz-result-item
                v-for="(r, i) in result.detailedAnswers"
                :key="r.question_id"
                :question_id="i + 1"
                :answers="r.answers"
                :question="questions[i]"
                :type_id="r.answers[0].type_id"
              ></quiz-result-item>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div class="col-1 col-sm-1 col-md-2 col-lg-3 col-xl-3"></div>
  </div>
</template>

<script>
import QuizResultItem from './QuizResultItem'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import "moment-duration-format";

export default {
  components: {QuizResultItem, FontAwesomeIcon},
  computed: {
        faCheckCircle() {
      return faCheckCircle;
    },
        displayTimeTaken() {
      return moment.duration(this.result.time_taken, "seconds").format("h [hours], m [minutes], s [seconds]");
    },
  },
  created() {
    
    this.result = this.$store.getters["quizStore/getQuizResult"];
    this.questions = this.$store.getters["questionStore/getQuestionList"];
    console.log(this.result)
  },
};
</script>

<style scoped>
h1, h3, p, ol { font-family: sans-serif; }

.header-title {
  padding-bottom: 0px !important;
}

h2 {
  font-size: 12pt;
  font-weight: 300;
  margin: 0;
  line-height: 0;
}

.quiz-result {
  width: 100%;
  height: auto;
  background-color: #0d0f13;
  border-radius: 5px;
  -webkit-box-shadow: 0px 0px 47px 9px rgba(0, 0, 0, 0.08);
  -moz-box-shadow: 0px 0px 47px 9px rgba(0, 0, 0, 0.08);
  box-shadow: 0px 0px 47px 9px rgba(0, 0, 0, 0.08);
}
.quiz-result h1 {
  text-align: center;
}

.quiz-result-header {
  width: 100%;
  height: auto;
  background-color: #6355ce;
  white-space: initial;
  overflow: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 20px;
  color: #eee;
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

@media screen and (max-width: 400px) {
  .question h3 {
    padding-top: 0px;
  }
}

.button-control {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: #dddddd;
}

@media (max-width: 768px) {
  .quiz-result {
    width: 100%;
  }
}

.instruction {
  font-weight: bold;
}

.wrapper {
  display: flex;
  justify-content: center;
}

table {
  width: 100%;
  height: 100%;
    font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}


td {
  padding: 15px;
}
</style>