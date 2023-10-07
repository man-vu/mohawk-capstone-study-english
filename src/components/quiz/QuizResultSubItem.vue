<template>
  <div>
    <span v-if="type_id !== 1" class="subquestion-id"
      >{{ sequence_id }}.{{ displayedAnswer }}</span
    >

    
    <span v-else :class="{ 'is-selected': answer === 1}">
      <span :class="{'circle': answer === 1 ? true : false}">{{ characters[choice_id - 1] }}</span>.{{choice_text}}
      
    </span>

    <span v-if="type_id === 1">
    <font-awesome-icon
      v-if="shouldDisplayIcon && isCorrect === true"
      class="ml-1"
      :icon="faCheckCircle"
      :style="{ color: 'greenyellow', borderColor: 'white' }"
    ></font-awesome-icon>

    <font-awesome-icon
      v-else-if="shouldDisplayIcon && isCorrect === false"
      class="ml-1"
      :icon="faTimesCircle"
      :style="{ color: 'red', borderColor: 'white' }"
    ></font-awesome-icon>
    </span>
    <span v-else>
          <font-awesome-icon
      v-if="isCorrect === true"
      class="ml-1"
      :icon="faCheckCircle"
      :style="{ color: 'greenyellow' }"
    ></font-awesome-icon>

    <font-awesome-icon
      v-else-if="isCorrect === false"
      class="ml-1"
      :icon="faTimesCircle"
      :style="{ color: 'red' }"
    ></font-awesome-icon>
    </span>

    <span v-if="isCorrect === false && type_id !== 1" class="correct-answer"
      >&nbsp;{{ `Correct answer: ${correct_answer}` }}</span
    >

    <span v-if="shouldDisplayIcon && !isCorrect && is_correct_choice === 1 && type_id === 1" class="correct-answer"
      >&nbsp;(should have been selected)</span
    >
    <span v-else-if="shouldDisplayIcon && !isCorrect &&is_correct_choice === 0 && type_id === 1" class="correct-answer"
      >&nbsp;(should <strong>not</strong> have been selected)</span
    >
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { characters } from "../common/helper";

export default {
  components: { FontAwesomeIcon },
  computed: {
    displayedAnswer() {
      return this.answer === "?" || !this.answer ? "Unanswered" : this.answer;
    },

    faCheckCircle() {
      return faCheckCircle;
    },
    faTimesCircle() {
      return faTimesCircle;
    },
    shouldDisplayIcon() {
      if (this.is_correct_choice === 1 && this.answer === 1) {
        return true;
      } else if (this.is_correct_choice === 0 && this.answer === 1) {
        return true;
      } else if (this.is_correct_choice === 1 && this.answer === 0) {
        return true
      } else {
        return false
      }
    }
  },
  props: [
    "answer",
    "correct_answer",
    "type_id",
    "sequence_id",
    "marked",
    "is_correct_choice",
    "choice_id",
    "choice_text",
  ],
  data() {
    return {
      isCorrect: false,
    };
  },
  created() {
    this.characters = characters;

    if (this.type_id === 1) {
      this.isCorrect = this.marked;
    } else {
      this.isCorrect = this.answer ? this.marked : false;
    }

    // if (this.type_id === 1) {
    //   console.log(this.is_correct_choice);
    //   console.log(this.choice_text);
    //   console.log(this.choice_id);
    //   console.log(this.marked);
    //   console.log(this.answer);

    //   const a = 3;
    // }
  },
};
</script>

<style  scoped>
.subquestion-id {
  font-weight: 100;
  font-size: 10pt;
}

.correct-answer {
  font-style: italic;
}

.is-selected {
  font-weight: bold;
}

.circle {
    border-radius: 50%;
    border: solid #eee 2px;
        padding: 3px;
    margin-left: -4px;

}
</style>