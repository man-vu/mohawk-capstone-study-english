<template>
  <tr>
    <td>
      <span class="question-title"
        >Question {{ question_id }}
        <span class="badge badge-pill" :class="badgeClass">{{
          displayedQuestionType
        }}</span>
      </span>

      <div class="mt-3 mb-3" v-if="type_id === 1">
        <div v-html="question.question"></div>
      </div>
      <quiz-result-sub-item
        v-for="(answer, i) in answers"
        :key="i + 1"
        :sequence_id="i + 1"
        :answer="
          answer.user_answer === null || answer.user_answer === undefined
            ? null
            : answer.user_answer
        "
        :correct_answer="answer.correct_answer"
        :type_id="type_id"
        :marked="answer.marked"
        :is_correct_choice="answer.is_correct_choice"
        :choice_id="answer.choice_id"
        :choice_text="answer.choice_text"
      ></quiz-result-sub-item>
    </td>
  </tr>
</template>

<script>
import QuizResultSubItem from "./QuizResultSubItem";

export default {
  props: ["question_id", "answers", "type_id", "question"],
  components: { QuizResultSubItem },
  computed: {
    displayedQuestionType() {
      if (this.type_id === 1) {
        return "Multiple Choice";
      } else if (this.type_id === 2) {
        return "Gap Filling";
      } else if (this.type_id === 3) {
        return "Matching Question";
      } else {
        return "";
      }
    },
    badgeClass() {
      const badges = {
        1: "danger",
        2: "primary",
        3: "success",
      };

      return `badge-${badges[this.question.type_id]}`;
    },
  },
  created() {},
};
</script>

<style scoped>
td {
  border: 1px solid #ddd;

  padding: 8px;
}

tr:nth-child(even) {
  background: #23334b;
}

td {
  padding: 15px;
}

.question-title {
  font-weight: bold;
}
</style>