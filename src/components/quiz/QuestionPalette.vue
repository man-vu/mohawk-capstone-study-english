<template>
  <div class="bg-purple" id="sidebar-wrapper">
    <div class="sidebar-heading">
      <h6>
        <span @click="toggleShowQuestions" class="question-palette-header"><font-awesome-icon :icon="faBars"></font-awesome-icon> 
        Question Palette
        <font-awesome-icon
          v-if="!showQuestionsSwitch"
          :icon="faCaretUp"
          class="showQuestionsIcon"
        ></font-awesome-icon>
        <font-awesome-icon
          v-else
          :icon="faCaretDown"
          class="showQuestionsIcon"
        ></font-awesome-icon>
        </span>
        <span class="float-right">
          <font-awesome-icon :icon="faClock"></font-awesome-icon>&nbsp;Time
          Left: {{ displayCountdownTimer }}
        </span>
      </h6>
    </div>

    <div v-if="showQuestionsSwitch" class="row mt-3 mb-3">
      <question-palette-item
        v-for="(q, index) in liveQuestions"
        :key="index"
        :number="index + 1"
        :question="q"
      >
      </question-palette-item>
    </div>
    <div>
      <button @click="showDialogModal = true" class="btn btn-primary">
        <font-awesome-icon :icon="faPaperPlane"></font-awesome-icon> Submit
      </button>
    </div>
    <dialog-modal v-if="showDialogModal">
    <template #header>Wait a second...</template>
    <template #body><div v-if="unansweredCount > 0"> You have <span class="unanswered-count"> {{ unansweredCount }} questions unanswered</span>. Are you sure to submit your quiz anyway?</div>
    <div v-else>Are you sure to submit your quiz?</div></template>
    <template #footer>
      <button class="btn btn-primary" @click="submit(); showDialogModal = false; " >
        Save
      </button> 
      <button class="btn btn-secondary" @click="showDialogModal = false">
        Close
      </button>
    </template>
    </dialog-modal>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import "moment-duration-format";
import QuestionPaletteItem from "./QuestionPaletteItem.vue";
import DialogModal from "./DialogModal"

export default {
  props: ["questions", "timer"],
  components: { FontAwesomeIcon, QuestionPaletteItem, DialogModal },
  data() {
    return {
      timeLeft: 0,
      expiredTime: 0,
      interval: 1000,
      timeout: null,
      showQuestionsSwitch: false,
      showDialogModal: false,
    };
  },
  computed: {
    unansweredCount() {
      
      return this.questions.filter(q => q.answer_text === '').length
    },
    displayCountdownTimer() {
      return moment.duration(this.timeLeft, "seconds").format("hh:mm:ss");
    },
    faBars() {
      return faBars;
    },
    faClock() {
      return faClock;
    },
    faPaperPlane() {
      return faPaperPlane;
    },
        faCaretDown() {
      return faCaretDown;
    },
        faCaretUp() {
      return faCaretUp;
    },
    liveQuestions() {
      return this.$store.getters["questionStore/getQuestionList"];
    },
  },
  methods: {
    submit() {
      console.log(this.questions);
      this.$store
        .dispatch("quizStore/submitQuiz", {
          quizId: this.questions[0].quiz_id,
          attemptId: this.questions[0].attempt_id,
        })
        .then((response) => {
          this.$router.push({ name: "quiz-result" });
        });
    },
    countDownTimer() {
      if (this.timeLeft > 0) {
        this.timeout = setTimeout(() => {
          this.timeLeft -= 1;
          this.countDownTimer();
        }, this.interval);
      } else {
        clearTimeout(this.timeout);
        this.submit();
      }
    },
    toggleShowQuestions() {
      this.showQuestionsSwitch = !this.showQuestionsSwitch;
    },
  },
  created() {
    this.timeLeft = -1 * this.timer.time_left;
    this.expiredTime = this.timer.expired_time;

    this.countDownTimer();
  },
};
</script>

<style scoped>
#wrapper {
  overflow-x: hidden;
}

#sidebar-wrapper {
  width: 20rem;
  min-height: 100vh;
  margin-left: -15rem;
  -webkit-transition: margin 0.25s ease-out;
  -moz-transition: margin 0.25s ease-out;
  -o-transition: margin 0.25s ease-out;
  transition: margin 0.25s ease-out;
  padding: 0.875rem 1.25rem;
  font-size: 1.2rem;
}

#page-content-wrapper {
  min-width: 100vw;
}

#wrapper.toggled #sidebar-wrapper {
  margin-left: 0;
}

#sidebar-wrapper .list-group {
  width: 15rem;
  display: flex;
  justify-content: space-between;
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

.question-list {
  display: flex;
}

button {
  font-weight: 600;
  width: 100%;
}

.bg-purple {
  background-color: #222928;
}

.bg-purple-cover:hover {
  background-color: #6355ce;
}

.showQuestionsIcon {
  cursor: pointer;
}

.question-palette-header {
  cursor: pointer;
}

.unanswered-count {
  font-weight: bold;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 350px) {
      h6 {
    font-size: 14px;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
      h6 {
    font-size: 24px;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
      h6 {
    font-size: 24px;
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
    h6 {
    font-size: 24px;
  }
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
    h6 {
    font-size: 28px;
  }
}
</style>