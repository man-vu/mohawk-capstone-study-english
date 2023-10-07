<template>
  <div class="course-container">
    <div class="course">
      <div class="course-preview">
        <h6>Course</h6>
        <h2>{{ course_name }}</h2>
        <quiz-list-item-rating
          :id="quiz_id"
          :rating="averageRating"
          :ratingCount="ratingCount"
          :ratingGiven="ratingGiven"
        ></quiz-list-item-rating>
      </div>
      <div class="course-info" :class="favoriteQuiz">
        <quiz-list-item-favorite
          class="favorite-icon"
          :id="quiz_id"
          :favorite="favorite"
        ></quiz-list-item-favorite>
        <div class="course-info-content">
          <div class="progress-container">
            <div class="progress">
              <div class="progress--after" :style="progressBar"></div>
            </div>
            <span class="progress-text"> {{ progressText }} Challenges </span>
          </div>

          <h5 class="skill-wrapper">
            <span class="badge badge-pill" :class="badgeClass">{{
              skill_description
            }}</span>
          </h5>
          <h4 class="mb-4">{{ description }}</h4>
          <a @click="navigateToDiscussion" href="" class="discussion-title"
            >Discussion</a
          >
          <button @click="navigateToQuiz" v-if="latestAttempt" class="btn">
            Continue
          </button>
          <button
            @click="navigateToQuiz"
            v-else-if="numberOfQuestions > 0"
            class="btn"
          >
            Start
          </button>
          <button
            @click="navigateToQuiz"
            v-else-if="numberOfQuestions === 0"
            class="btn"
            disabled
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QuizListItemRating from "./QuizListItemRating";
import QuizListItemFavorite from "./QuizListItemFavorite";

export default {
  props: [
    "quiz_id",
    "course_name",
    "skill_id",
    "description",
    "is_active",
    "time_allowed",
    "created_by",
    "created_at",
    "skill_description",
    "numberOfQuestions",
    "averageRating",
    "ratingCount",
    "latestAttempt",
    "favorite",
    "ratingGiven"
  ],
  components: { QuizListItemRating, QuizListItemFavorite },
  computed: {
    badgeClass() {
      const badges = {
        1: "secondary",
        2: "primary",
        3: "success",
        4: "danger",
        5: "warning",
        6: "info",
      };

      return `badge-${badges[this.skill_id]}`;
    },
    isAuthenticated() {
      return this.$store.getters["authStore/isAuthenticated"];
    },
    progressText() {
      return (
        (this.latestAttempt ? this.latestAttempt.answered : 0) +
        "/" +
        this.numberOfQuestions
      );
    },
    progressBar() {
      if (this.latestAttempt) {
        if (this.latestAttempt.answered >= this.numberOfQuestions) {
          return { width: 100 + "%" };
        } else {
          return {
            width: (this.latestAttempt.answered / this.numberOfQuestions) * 100 + "%",
          };
        }
      } else {
        return { width: 0 + "%" };
      }
    },
    favoriteQuiz() {
      return {
        "course-info--yellow":
          this.favorite && this.isAuthenticated ? true : false,
      };
    },
  },
  methods: {
    navigateToQuiz() {
      this.$router.push({
        name: "quizzes.index",
        params: { id: this.quiz_id },
      });
    },
    navigateToDiscussion() {
      this.$router.push({
        name: "discussion.index",
        query: { quizid: this.quiz_id },
      });
    },
  },
};
</script>

<style scoped>
.course {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  max-width: 100%;
  margin: 20px;
  overflow: hidden;
  width: 700px;

  -webkit-box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.45);
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.45);
}

.course h6 {
  opacity: 0.6;
  margin: 0;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.course h2 {
  letter-spacing: 1px;
  margin: 10px 0;
}

.course-preview {
  background-color: #6356ca;
  color: #fff;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  max-width: 290px;
  width: 290px;
}

.course-preview a {
  color: #fff;
  display: inline-block;
  font-size: 12px;
  opacity: 0.6;
  margin-top: 30px;
  text-decoration: none;
}

.course-info {
  padding: 30px;
  position: relative;
  width: 100%;
  color: #111;
}

.course-info--yellow {
  background-color: yellow;
  color: #111;
}

.progress-container {
  position: absolute;
  top: 30px;
  right: 30px;
  text-align: right;
  width: 150px;
}

.progress {
  background-color: #6356ca;
  border-radius: 3px;
  height: 5px;
  width: 100%;
}

.progress--after {
  border-radius: 3px;
  background-color: #2a265f;
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  height: 5px;
}

.progress-text {
  font-size: 10px;
  opacity: 0.6;
  letter-spacing: 1px;
}

.btn {
  background-color: #2a265f;
  border: 0;
  border-radius: 50px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
  color: #fff;
  font-size: 16px;
  padding: 6px 25px;
  position: absolute;
  bottom: 30px;
  right: 30px;
  letter-spacing: 1px;
  cursor: pointer;
}

.discussion-title {
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
  padding: 12px 25px;
  position: absolute;
  bottom: 15px;
  left: 5px;
  letter-spacing: 1px;
  cursor: pointer;
}

.favorite-icon {
  position: absolute;
  top: 5px;
  right: 5px;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  .course {
    display: flex;
    flex-direction: column;
  }

  .course-preview {
    width: unset;
    max-width: unset;
  }

  .progress-container {
    width: 90px;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (max-width: 600px) {
  .discussion-title {
    position: unset;
    padding: unset;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (max-width: 700px) {
  .course {
    width: unset;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
}
</style>