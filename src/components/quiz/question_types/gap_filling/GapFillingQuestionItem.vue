<template>
  <div class="quiz">
    <div class="quiz-header"></div>

    <div class="question">
      <h3 class="instruction" v-html="id + 1 + '. ' + instruction"></h3>
    </div>
    <div class="question-area p-4">
      <h4 class="text-center">{{ paragraph_title }}</h4>
      <p class="question-text"><span v-html="questionText"> </span></p>
    </div>
    <div class="response pb-3">
      <gap-filling-question-gap-item
        v-for="item in gapItems"
        :key="item.id"
        :id="item.id"
        :response="item.response"
        @updateResponse="updateResponse"
      ></gap-filling-question-gap-item>
    </div>
  </div>
</template>

<script>
import GapFillingQuestionGapItem from "./GapFillingQuestionGapItem";

const regex = /{(\d*)}/g;
export default {
  props: ["id", "text", "instruction", "paragraph_title", "question"],
  components: { GapFillingQuestionGapItem },
  computed: {
    questionText() {
      let formattedText = this.text.replaceAll(
        regex,
        (match, p1, p2, p3, offset, string) => {
          if (p1 === "0") return "";
          else return `(${p1}) _____`;
        }
      );

      return formattedText;
    },
  },
  data() {
    return {
      gapItems: [],
    };
  },
  created() {
    
    if (this.question.answer_text) {
      let items = this.question.answer_text.split(",").map((s) => s.split("."));

      for (let i = 0; i < this.question.content.length; i++) {
        let gap = this.question.content[i];
        this.gapItems.push({
          id: gap.sequence_id,
          response: items[i][1] === "?" ? "" : items[i][1],
        });
      }
      console.log(this.paragraph_title);
    } else {
      this.gapItems = new Array(this.question.content.length) .fill()
        .map((e, i) => {
          return { id: i + 1, response: "" };
        });
    }
  },
  methods: {
    updateResponse(index, response) {
      let gapItem = this.gapItems.find((g) => g.id === index);
      gapItem.response = response;

      let answerText = this.gapItems.reduce(
        (acc, cur) => acc + `${cur.id}.${cur.response ? cur.response : "?"},`,
        ""
      );

      answerText = answerText.substring(0, answerText.length - 1);

      console.log(answerText);

      this.$store.dispatch("questionStore/answerQuestion", {
        questionId: this.question.question_id,
        quizId: this.question.quiz_id,
        attemptId: this.question.attempt_id,
        answerText: answerText,
      });
    },
  },
};
</script>

<style scoped>
h1,
h3,
p {
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
  white-space: initial;
  overflow: auto;
  background-color: #6356ca;
}
.question h3 {
  padding-top: 16px;
  padding-left: 20px;
  font-size: 14pt;
}

.question-text {
  font-size: 15pt;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.question-area {
  background-color: #23334b;
}

.btn {
  border: 0;
  border-radius: 50px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  margin: 10px;
  padding: 12px 25px;
  /* position: relative; */
  /* left: 675px; */
  /* bottom: 30px; */
  /* right: 0px; */
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

.response {
  padding-top: 16px;
  padding-left: 20px;
  background-color: #23334b;
}
</style>