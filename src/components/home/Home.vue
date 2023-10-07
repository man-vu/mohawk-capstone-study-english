<template>
  <div id="sort-and-filter" class="details-wrapper">
    <div class="form-inline">
      <label>Sort by</label>
      <select
        name="sortBy"
        id="sort-by"
        class="form-control"
        v-model="filterEntity.sortBy"
        @change="filterAndSort"
      >
        <option class="dropdown-item" href="#" value="rating">Rating</option>
        <option class="dropdown-item" href="#" value="quiz-number">
          Quiz Number
        </option>
        <option class="dropdown-item" href="#" value="challenges">
          Challenges
        </option>
      </select>
    </div>
    <div class="form-inline">
      <label>Sort Order</label>
      <select
        name="sortBy"
        id="sort-by"
        class="form-control"
        v-model="filterEntity.sortOrder"
        @change="filterAndSort"
      >
        <option class="dropdown-item" href="#" value="asc">Ascending</option>
        <option class="dropdown-item" href="#" value="desc">Descending</option>
      </select>
    </div>
    <div class="form-inline">
      <label>Ratings</label>
      <select
        name="sortBy"
        id="sort-by"
        class="form-control"
        v-model="filterEntity.ratings"
        @change="filterAndSort"
      >
        <option class="dropdown-item" href="#" value="0">All ratings</option>
        <option class="dropdown-item" href="#" value="4.5">
          4.5 stars & up
        </option>
        <option class="dropdown-item" href="#" value="4.0">
          4.0 stars & up
        </option>
        <option class="dropdown-item" href="#" value="3.5">
          3.5 stars & up
        </option>
        <option class="dropdown-item" href="#" value="3.0">
          3.0 stars & up
        </option>
      </select>
    </div>
    <div class="form-inline" v-if="isAuthenticated">
      <label class="form-check-label">Favorite Only</label>
      <input
        type="checkbox"
        id="only-favorites"
        name="only-favorites"
        value="only-favorites"
        v-model="filterEntity.onlyFavorites"
        @change="filterAndSort"
      />
    </div>
  </div>
  <div class="quizzes-list-container">
    <div v-if="!isLoading">
      <div v-if="quizzes.length > 0">
        <h3 class="m-3 text-center">Select a quiz to level up your English level</h3>
        <quiz-list-item
          v-for="quiz in quizzes"
          :favorite="quiz.favorite"
          :key="quiz.quiz_id"
          :quiz_id="quiz.quiz_id"
          :skill_id="quiz.skill_id"
          :course_name="quiz.course_name"
          :description="quiz.description"
          :is_active="quiz.is_active"
          :time_allowed="quiz.time_allowed"
          :created_by="quiz.created_by"
          :created_at="quiz.created_at"
          :skill_description="quiz.skill_description"
          :latestAttempt="quiz.latestAttempt"
          :numberOfQuestions="quiz.number_of_questions"
          :averageRating="quiz.average_rating"
          :ratingCount="quiz.rating_count"
          :ratingGiven="quiz.rating_given"
        ></quiz-list-item>
      </div>
      <div v-else>
        <h3>No quizzes found.</h3>
      </div>
      <div v-if="pagination.totalPages !== null" class="block-27 text-center">
        <ul>
          <li><span class="page-number" @click="prevPage()">&lt;</span></li>
          <li
            :class="{ active: page === pagination.currentPage }"
            v-for="page in pagination.totalPages"
            :key="page"
          >
            <span class="page-number" @click="specificPage(page)">{{
              page
            }}</span>
          </li>
          <li><span class="page-number" @click="nextPage()">&gt;</span></li>
        </ul>
        <p class="font-italic pagination-caption">
          Showing
          <span class="badge badge-pill badge-secondary">{{
            quizzes.length
          }}</span>
          out of
          <span class="badge badge-pill badge-secondary">{{
            originalQuizzes.length
          }}</span>
          quizzes in total
        </p>
      </div>
    </div>
    <div v-else>
      <h1>Loading data...</h1>
    </div>
  </div>
</template>

<script>
import QuizListItem from "./QuizListItem.vue";
import { paginator } from "../common/helper";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  components: { QuizListItem },
  data() {
    return {
      searchEntity: {
        subject: "",
        userId: "",
        quizId: "",
        dateCreated: "",
      },
      filterEntity: {
        isFiltered: false,
        sortBy: "quiz-number",
        sortOrder: "asc",
        quizId: "",
        onlyFavorites: false,
        ratings: 0,
      },
      pagination: {
        currentPage: 1,
        totalPages: null,
        pagesPerPage: 10,
        nextPage: null,
        prevPage: null,
      },
      isLoading: true,
      quizzes: [],
      originalQuizzes: [],
    };
  },
  created() {
    this.$store.dispatch("homeStore/getDataForHome").then((response) => {
      this.originalQuizzes = this.$store.getters["homeStore/getQuizList"];
      this.quizzes = this.$store.getters["homeStore/getQuizList"];

      this.filterAndSort()
      this.isLoading = false;
    });
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["authStore/isAuthenticated"];
    },
  },
  methods: {
    paginate(currentPage, pagesPerPage) {
      const paginated = paginator(
        this.quizzes,
        currentPage || this.pagination.currentPage,
        pagesPerPage || this.pagination.pagesPerPage
      );

      this.quizzes = paginated.data;
      this.pagination.totalPages = paginated.total_pages;
      this.pagination.currentPage = paginated.page;
      this.pagination.prevPage = paginated.pre_page;
      this.pagination.nextPage = paginated.next_page;
    },
    prevPage() {
      if (this.pagination.prevPage !== null) {
        this.changePage(this.pagination.prevPage);
      }
    },
    nextPage() {
      if (this.pagination.nextPage !== null) {
        this.changePage(this.pagination.nextPage);
      }
    },
    specificPage(page) {
      if (page !== null) {
        this.changePage(page);
      }
    },
    changePage(changeTo) {
      const paginated = paginator(
        this.originalQuizzes,
        changeTo,
        this.pagination.pagesPerPage
      );

      this.quizzes = paginated.data;
      this.pagination.currentPage = paginated.page;
      this.pagination.prevPage = paginated.pre_page;
      this.pagination.nextPage = paginated.next_page;

      // this.filterAndSort()
    },
    sort() {
      const reverse = this.filterEntity.sortOrder === "asc" ? 1 : -1;

      if (this.filterEntity.sortBy === "rating") {
        this.quizzes = this.quizzes.sort((a, b) => {
          return reverse * (a.average_rating - b.average_rating);
        });
      } else if (this.filterEntity.sortBy === "quiz-number") {
        this.quizzes = this.quizzes.sort(
          (a, b) => reverse * (a.quiz_id - b.quiz_id)
        );
      } else if (this.filterEntity.sortBy === "challenges") {
        this.quizzes = this.quizzes.sort(
          (a, b) => reverse * (a.number_of_questions - b.number_of_questions)
        );
      }
    },
    filter() {
      if (this.filterEntity.ratings == 0 && !this.filterEntity.onlyFavorites) {
        this.filterEntity.isFiltered = false;
        this.originalQuizzes = this.$store.getters["homeStore/getQuizList"];
        this.quizzes = this.originalQuizzes;
      } else {
        this.filterEntity.isFiltered = true;

        this.originalQuizzes = this.$store.getters[
          "homeStore/getQuizList"
        ].filter((quiz) => quiz.average_rating >= this.filterEntity.ratings);

        this.originalQuizzes = this.filterEntity.onlyFavorites
          ? this.originalQuizzes.filter((quiz) => quiz.favorite === 1)
          : this.originalQuizzes;

        this.quizzes = this.originalQuizzes;
      }
    },
    filterAndSort() {
      this.filter();
      this.sort();
      this.paginate();
    },
  },
};
</script>

<style scoped>
.pagination-caption {
  font-size: 18px;
}

.page-number {
  cursor: pointer;
}

.block-27 {
  color: #eee;
}

.block-27 ul {
  padding: 0;
  margin: 0;
}
.block-27 ul li {
  display: inline-block;
  margin-bottom: 4px;
  font-weight: 400;
}
.block-27 ul li a,
.block-27 ul li span {
  color: gray;
  text-align: center;
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 50%;
  border: 1px solid #e6e6e6;
}
.block-27 ul li.active a,
.block-27 ul li.active span {
  background: #6356ca;
  color: #fff;
  border: 1px solid transparent;
}

.details-wrapper div {
  padding: 1em;
}

#sort-and-filter {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #6356ca;
  color: #eee;
}

#sort-and-filter label {
  font-weight: bold;
  padding-right: 10px;
}

.quizzes-list-container {
  /* background-image: linear-gradient(45deg, #7175da, #9790F2); */
  font-family: "Muli", sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  margin: 0;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  #sort-and-filter {
    display: block;
  }
  .quizzes-list-container {
    display: block;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {

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