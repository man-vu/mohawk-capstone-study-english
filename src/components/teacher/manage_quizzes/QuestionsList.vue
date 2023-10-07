<template>
  <div>
    <h3>Question List</h3>
    <div class="table">
      <div class="row header">
        <div class="cell"><strong>ID</strong></div>
        <div class="cell"><strong>Type</strong></div>
        <div class="cell"><strong>Instruction</strong></div>
        <div class="cell"><strong>Paragraph Title</strong></div>
        <div class="cell"><strong>Question</strong></div>
        <div class="cell"><strong>Active</strong></div>
        <div class="cell"><strong>Action</strong></div>
      </div>

      <question-list-item
        v-for="q in questions"
        :key="q.question_id"
        :question="q"
      ></question-list-item>
    </div>
  </div>
  <div v-if="pagination.totalPages !== null" class="block-27 text-center">
    <ul>
      <li><span class="page-number" @click="prevPage()">&lt;</span></li>
      <li
        :class="{ active: page === pagination.currentPage }"
        v-for="page in pagination.totalPages"
        :key="page"
      >
        <span class="page-number" @click="specificPage(page)">{{ page }}</span>
      </li>
      <li><span class="page-number" @click="nextPage()">&gt;</span></li>
    </ul>
    <p class="font-italic pagination-caption">
      Showing
      <span class="badge badge-pill badge-secondary">{{
        questions.length
      }}</span>
      out of
      <span class="badge badge-pill badge-secondary">{{
        originalQuestions.length
      }}</span>
      questions in total
    </p>
  </div>
</template>

<script>
import QuestionListItem from "./QuestionListItem";
import { paginator } from "../../common/helper";

export default {
  components: { QuestionListItem },
  data() {
    return {
      pagination: {
        currentPage: 1,
        totalPages: null,
        pagesPerPage: 10,
        nextPage: null,
        prevPage: null,
      },
      questions: [],
      originalQuestions: [],
    };
  },
  watch: {
    latestQuestions(value) {
      this.questions = value;
      this.originalQuestions = value;
      this.paginate();
    },
  },
  computed: {
    latestQuestions() {
      return this.$store.getters["teacherStore/getEditQuestions"];
    },
  },
  created() {
    this.originalQuestions = this.$store.getters[
      "teacherStore/getEditQuestions"
    ];
    this.questions = this.$store.getters["teacherStore/getEditQuestions"];
    this.paginate();
  },
  methods: {
    paginate(currentPage, pagesPerPage) {
      const paginated = paginator(
        this.questions,
        currentPage || this.pagination.currentPage,
        pagesPerPage || this.pagination.pagesPerPage
      );

      this.questions = paginated.data;
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
        this.originalQuestions,
        changeTo,
        this.pagination.pagesPerPage
      );

      this.questions = paginated.data;
      this.pagination.currentPage = paginated.page;
      this.pagination.prevPage = paginated.pre_page;
      this.pagination.nextPage = paginated.next_page;
    },
  },
};
</script>

<style scoped>
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

.button-item {
  cursor: pointer;
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
</style>