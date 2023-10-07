<template>
  <div v-if="!isLoading">
    <h2>Quiz List</h2>
    <div class="header d-flex mb-2">
      <button
        class="btn btn-info dropdown-toggle"
        type="button"
        id="sort-by"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <strong> Sort By</strong>: {{ filterEntity.sortBy }}
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" @click="sort('Quiz Id')" href="#">Quiz Id</a>
        <a class="dropdown-item" @click="sort('Course Name')" href="#"
          >Course Name</a
        >
        <a class="dropdown-item" @click="sort('Skill Name')" href="#"
          >Skill Name</a
        >
        <a class="dropdown-item" @click="sort('Attempts')" href="#">Attempts</a>
        <a class="dropdown-item" @click="sort('Average Rating')" href="#"
          >Average Rating</a
        >
      </div>
      <button type="button" @click="createQuiz" class="mb-2 btn btn-primary">
        Create Quiz
      </button>
    </div>
    <div v-if="quizzes.length > 0" class="table">
      <div class="row header">
        <div class="cell"><strong>ID</strong></div>
        <div class="cell"><strong>Course Name</strong></div>
        <div class="cell"><strong>Active</strong></div>
        <div class="cell"><strong>Questions</strong></div>
        <div class="cell"><strong>Attempts</strong></div>
        <div class="cell"><strong>Time Allowed</strong></div>
        <div class="cell"><strong>Average Rating</strong></div>
        <div class="cell"><strong>Action</strong></div>
      </div>

      <div class="row" v-for="quiz in quizzes" :key="quiz.quiz_id">
        <div class="cell" data-title="ID">
          {{ quiz.quiz_id }}
          <span class="badge badge-pill" :class="badgeClass(quiz.skill_id)">
            {{ quiz.skill_description }}</span
          >
        </div>
        <div class="cell" data-title="Course Name">{{ quiz.course_name }}</div>
        <div class="cell" data-title="Active">
          {{ quiz.is_active === 1 ? "Yes" : "No" }}
        </div>
        <div class="cell" data-title="Questions">
          {{ quiz.number_of_questions }}
        </div>
        <div class="cell" data-title="Attempts">{{ quiz.attempts }}</div>
        <div class="cell" data-title="Time Allowed">
          {{ quiz.time_allowed }}
        </div>
        <div class="cell" data-title="Average Rating">
          {{
            quiz.average_rating
              ? quiz.average_rating.toFixed(2)
              : Number(0).toFixed(2)
          }}
          {{ `(${quiz.rating_count ? quiz.rating_count : 0})` }}
          <font-awesome-icon
            class="button-item"
            :icon="faEraser"
            @click="
              modal.showModal = true;
              modal.handler = resetRating;
              modal.quizId = quiz.quiz_id;
              modal.primaryButton = 'Reset';
              modal.header = `Reset ratings for Quiz ${quiz.quiz_id} - ${quiz.description}`;
            "
            :style="{ color: 'red' }"
          ></font-awesome-icon>
        </div>
        <div class="cell" data-title="Action">
          <font-awesome-icon
            class="button-item"
            :icon="faEdit"
            @click="editQuiz(quiz.quiz_id)"
          ></font-awesome-icon>
          <font-awesome-icon
            class="button-item ml-2"
            :icon="faTrashAlt"
            :style="{ color: 'red' }"
            @click="
              modal.showModal = true;
              modal.handler = deleteQuiz;
              modal.quizId = quiz.quiz_id;
              modal.primaryButton = 'Delete';
              modal.header = `Delete Quiz ${quiz.quiz_id} - ${quiz.description}`;
              
            "
          ></font-awesome-icon>
        </div>
      </div>
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
  <dialog-modal v-if="modal.showModal">
    <template #header>{{ modal.header }}</template>
    <template #body></template>
    <template #footer>
      <button
        class="btn btn-danger"
        @click="
          modal.handler(modal.quizId);
          modal.showModal = false;
        "
      >
        {{ modal.primaryButton }}
      </button>
      <button class="btn btn-secondary" @click="modal.showModal = false">
        Close
      </button>
    </template>
  </dialog-modal>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faEraser } from "@fortawesome/free-solid-svg-icons";
import { paginator } from "../../common/helper";
import DialogModal from "./DialogModal";

export default {
  components: { FontAwesomeIcon, DialogModal },
  emits: ["toggleShowQuizEditor", "setStatusMessages"],
  data() {
    return {
      isLoading: true,
      quizzes: [],
      originalQuizzes: [],
      pagination: {
        currentPage: 1,
        totalPages: null,
        pagesPerPage: 10,
        nextPage: null,
        prevPage: null,
      },
      filterEntity: {
        isFiltered: false,
        sortBy: "Quiz Id",
        quizId: "",
        selectedQuiz: "All quizzes",
      },
      modal: {
        header: "",
        body: "",
        quizId: null,
        showModal: false,
        handler: null,
        primaryButton: ""
      },
    };
  },
  computed: {
    faEdit() {
      return faEdit;
    },
    faTrashAlt() {
      return faTrashAlt;
    },
    faEraser() {
      return faEraser;
    },
    latestQuizzes() {
      return this.$store.getters["teacherStore/getQuizList"];
    },
  },
  watch: {
    latestQuizzes(value) {
      this.quizzes = value;
      this.originalQuizzes = value;
      this.paginate();
    },
  },
  created() {
    this.$store.dispatch("teacherStore/getDataForTeacher").then((response) => {
      this.quizzes = this.$store.getters["teacherStore/getQuizList"];
      this.originalQuizzes = this.quizzes;
      this.isLoading = false;
      this.sort("Quiz Id")
    });
  },
  methods: {
    badgeClass(skillId) {
      const badges = {
        1: "secondary",
        2: "primary",
        3: "success",
        4: "danger",
        5: "warning",
        6: "info",
      };

      return `badge-${badges[skillId]}`;
    },
    createQuiz() {
      this.$emit("toggleShowQuizEditor", { mode: "create", action: "open" });
    },
    editQuiz(quizId) {
      this.$emit("setStatusMessages");

      this.$emit("toggleShowQuizEditor", {
        mode: "edit",
        quizId,
        action: "open",
      });
    },
    resetRating(quizId) {
      this.$emit("setStatusMessages");

      if (quizId) {
        this.$store
          .dispatch("teacherStore/resetRating", { quizId: quizId })
          .then((response) => {
            if (response === "OK") {
              this.$emit(
                "setStatusMessages",
                "",
                `Quiz ${quizId}'s ratings have been reset`
              );
            } else {
              this.$emit("setStatusMessages", response);
            }
          });
      } else {
        this.$emit("setStatusMessages", "Quiz Id must be specified.");
      }
    },
    deleteQuiz: function (quizId) {
      this.$emit("setStatusMessages");

      this.$store
        .dispatch("teacherStore/deleteQuiz", { quizId })
        .then((response) => {
          if (response === "OK") {
            this.$emit(
              "setStatusMessages",
              "",
              `Quiz ${quizId} has been deleted`
            );
            this.$emit("toggleShowQuizEditor", {
              mode: "delete",
              quizId,
              action: "close",
            });
          } else {
            this.$emit("setStatusMessages", response);
          }
        });
    },
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
    },
    sort(sortBy) {
      this.filterEntity.sortBy = sortBy;
      if (sortBy === "Quiz Id") {
        this.quizzes = this.originalQuizzes.sort((a, b) => a.quiz_id - b.quiz_id);
      } else if (sortBy === "Course Name") {
        
        this.quizzes = this.originalQuizzes.sort((a, b) => a.course_name.localeCompare( b.course_name));
      } else if (sortBy === "Skill Name") {
        this.quizzes = this.originalQuizzes.sort((a, b) => a.skill_description.localeCompare( b.skill_description)); 
      } else if (sortBy === "Attempts") {
        this.quizzes = this.originalQuizzes.sort((a, b) => a.attempts - b.attempts);
      } else {
        this.quizzes = this.originalQuizzes.sort((a, b) => a.average_rating - b.average_rating);
      }

      this.paginate();
    },
    filterAndSort() {
      this.sort();
      this.paginate();
    },
  },
};
</script>

<style scoped>
body {
  color: #eee;
}

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

body {
  margin: 0;
  background: linear-gradient(45deg, #49a09d, #5f2c82);
  font-family: sans-serif;
  font-weight: 100;

  font-weight: 400;
  color: #3b3b3b;
  -webkit-font-smoothing: antialiased;
  font-smoothing: antialiased;
  background: #2b2b2b;
}

tbody tr:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
tbody td {
  position: relative;
}
tbody td:hover:before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: -9999px;
  bottom: -9999px;
  background-color: rgba(255, 255, 255, 0.2);
  z-index: -1;
}

@media screen and (max-width: 580px) {
  body {
    font-size: 16px;
    line-height: 22px;
  }
}

.page-number {
  cursor: pointer;
}
.wrapper {
  margin: 0 auto;
  padding: 40px;
  max-width: 800px;
}

.table {
  margin: 0 0 40px 0;
  width: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  display: table;
}
@media screen and (max-width: 580px) {
  .table {
    display: block;
  }
}

.row {
  display: table-row;
  background: #23334b;
  color: #eee;
}
.row:nth-of-type(odd) {
  background: #0d0f13;
  color: #eee;
}
.row.header {
  color: #ffffff;
  background: #6356ca;
}
.row.green {
  background: #27ae60;
}
.row.blue {
  background: #2980b9;
}
@media screen and (max-width: 580px) {
  .row {
    padding: 14px 0 7px;
    display: block;
  }
  .row.header {
    padding: 0;
    height: 6px;
  }
  .row.header .cell {
    display: none;
  }
  .row .cell {
    margin-bottom: 10px;
  }
  .row .cell:before {
    margin-bottom: 3px;
    content: attr(data-title);
    min-width: 98px;
    font-size: 10px;
    line-height: 10px;
    font-weight: bold;
    text-transform: uppercase;
    color: #969696;
    display: block;
  }
}

.cell {
  padding: 6px 12px;
  display: table-cell;
}
@media screen and (max-width: 580px) {
  .cell {
    padding: 2px 16px;
    display: block;
  }
}

.header {
  justify-content: space-between;
}

.header button {
  color: #fff;
  font-weight: 600;
}

.button-item {
  cursor: pointer;
}
</style>