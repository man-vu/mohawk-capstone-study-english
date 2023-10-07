<template>
  <div id="sort-and-filter" class="details-wrapper">
    <div class="form-inline">
      <label>Thread Title</label>
      <input
        type="search"
        placeholder="Search All Threads"
        class="form-control"
        v-model="searchEntity.subject"
      />
    </div>
    <div class="form-inline">
      <label>Date created</label>
      <input
        type="date"
        class="form-control"
        v-model="searchEntity.dateCreated"
      />
    </div>
    <div class="form-inline dropdown">
      <button
        class="btn btn-info dropdown-toggle"
        type="button"
        id="sort-by"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <strong>Created By</strong>: {{ searchEntity.selectedUser }}
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="#" @click="changeUserId('', 'All users')"
          >All users</a
        >
        <a
          v-for="user in users"
          :key="user.user_id"
          :value="user.user_id"
          class="dropdown-item"
          @click="changeUserId(user.user_id, user.first_name)"
          href="#"
          >{{ `${user.first_name}, ${user.last_name}` }}</a
        >
      </div>
    </div>
    <div class="form-inline">
    <button @click="searchThreads" class="btn btn-primary">
      <font-awesome-icon :icon="faSearch"></font-awesome-icon>
    </button>
    </div>
  </div>

  <!-- MAIN -->
  <main class="mt-3">
    <div class="container">
      <div class="nav mb-3">
        <div class="form-inline dropdown">
          <button
            class="btn btn-info dropdown-toggle"
            type="button"
            id="sort-by"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <strong> Related Quiz</strong>: {{ filterEntity.selectedQuiz }}
          </button>
          <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <a
              class="dropdown-item"
              @click="changeQuizId('', 'All Quizzes')"
              href="#"
              >All Quizzes</a
            >
            <a
              v-for="quiz in quizzes"
              :key="quiz.quiz_id"
              :value="quiz.quiz_id"
              class="dropdown-item"
              :style="{'font-weight': filterEntity.selectedQuiz == quiz.quiz_id ? 'bold' : 'unset'}"
              @click="changeQuizId(quiz.quiz_id, quiz.description)"
              href="#"
              >{{ `${quiz.quiz_id} - ${quiz.description}` }}</a
            >
          </div>
        </div>
        <div class="form-inline dropdown ml-3">
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
            <a class="dropdown-item" @click="filterAndSort('Latest')" href="#">Latest</a>
            <a class="dropdown-item" @click="filterAndSort('Oldest')" href="#">Oldest</a>
            <a class="dropdown-item" @click="filterAndSort('Most Replies')" href="#"
              >Most Replies</a
            >
          </div>
        </div>
      </div>
      <div class="posts">
        <div v-if="!isLoading">
          <div v-if="threads.length > 0">
            <div class="table">
              <div class="row header">
                <div class="cell">Topic</div>
                <div class="cell">Category</div>
                <div class="cell">Users</div>
                <div class="cell">Replies</div>
                <div class="cell">Last Activity</div>
              </div>

              <discussion-forum-thread-item
                v-for="t in threads"
                :key="t.thread_id"
                :t="t"
              ></discussion-forum-thread-item>
            </div>

            <div
              v-if="pagination.totalPages !== null"
              class="block-27 text-center mt-3"
            >
              <ul>
                <li>
                  <span class="page-number" @click="prevPage()">&lt;</span>
                </li>
                <li
                  :class="{ active: page === pagination.currentPage }"
                  v-for="page in pagination.totalPages"
                  :key="page"
                >
                  <span class="page-number" @click="specificPage(page)">{{
                    page
                  }}</span>
                </li>
                <li>
                  <span class="page-number" @click="nextPage()">&gt;</span>
                </li>
              </ul>
              <p class="font-italic pagination-caption">
                Showing
                <span class="badge badge-pill badge-secondary">{{
                  threads.length
                }}</span>
                out of
                <span class="badge badge-pill badge-secondary">{{
                  originalThreads.length
                }}</span>
                threads in total
              </p>
            </div>
          </div>
          <div v-else>
            <h3>No threads found.</h3>
          </div>
        </div>
        <div v-else>
          <h1>Loading data...</h1>
        </div>
      </div>
    </div>
  </main>
  <div id="create-thread" class="create-thread">
     <router-link to="create-thread">
    <button class="btn btn-dark" title="Back to Top" style="display: block">
      <i class="fa fa-plus"></i>
      
    </button>
     </router-link>
  </div>
</template>

<script>
import DiscussionForumThreadItem from "./DiscussionForumThreadItem";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { paginator } from "../common/helper";
import moment from "moment";

export default {
  components: { DiscussionForumThreadItem, FontAwesomeIcon },
  data() {
    return {
      searchEntity: {
        subject: "",
        userId: "",
        selectedUser: "All users",
        dateCreated: "",
      },
      filterEntity: {
        isFiltered: false,
        sortBy: "Latest",
        quizId: "",
        selectedQuiz: "All quizzes",
      },
      pagination: {
        currentPage: 1,
        totalPages: null,
        pagesPerPage: 10,
        nextPage: null,
        prevPage: null,
      },
      isLoading: true,
      threads: [],
      originalThreads: [],
    };
  },
  computed: {
    quizzes() {
      console.log(this.$store.getters["forumStore/getQuizzes"]);
      return this.$store.getters["forumStore/getQuizzes"];
    },
    skills() {
      return this.$store.getters["forumStore/getSkills"];
    },
    users() {
      return this.$store.getters["forumStore/getUsers"];
    },
    faSearch() {
      return faSearch;
    },
    sortByLatest() {
      return { active: this.filterEntity.sortBy === "latest" ? true : false };
    },
    sortByOldest() {
      return { active: this.filterEntity.sortBy === "oldest" ? true : false };
    },
    sortByMostReplies() {
      return {
        active: this.filterEntity.sortBy === "most-replies" ? true : false,
      };
    },
  },
  created() {
    this.$store
      .dispatch("forumStore/getDataForDiscussion", {})
      .then((response) => {
        this.originalThreads = this.$store.getters["forumStore/getThreads"];
        this.threads = this.$store.getters["forumStore/getThreads"];

        const filteredByQuizId = this.$route.query.quizid;

        if (filteredByQuizId) {
          this.filterEntity.isFiltered = true;
          this.filterEntity.quizId = parseInt(filteredByQuizId);
          this.filter();
        } else {
          this.paginate();
        }

        this.isLoading = false;
      });
  },
  methods: {
    paginate(currentPage, pagesPerPage) {
      const paginated = paginator(
        this.threads,
        currentPage || this.pagination.currentPage,
        pagesPerPage || this.pagination.pagesPerPage
      );

      this.threads = paginated.data;
      this.pagination.totalPages = paginated.total_pages;
      this.pagination.currentPage = paginated.page;
      this.pagination.prevPage = paginated.pre_page;
      this.pagination.nextPage = paginated.next_page;
    },
    searchThreads() {
      const data = {
        userId: this.searchEntity.userId,
        quizId: this.searchEntity.quizId,
        subject: this.searchEntity.subject,
        dateCreated: this.searchEntity.dateCreated,
      };
      this.isLoading = true;
      this.$store
        .dispatch("forumStore/searchThreads", data)
        .then((response) => {
          this.threads = this.$store.getters["forumStore/getThreads"];
          this.filterEntity.isFiltered = false;
          this.filterEntity.quizId = "";
          this.paginate();
          this.isLoading = false;
        });
    },
    filter() {
      if (!this.filterEntity.quizId) {
        this.filterEntity.isFiltered = false;
        this.originalThreads = this.$store.getters["forumStore/getThreads"];
        this.threads = this.originalThreads;
      } else {
        this.filterEntity.isFiltered = true;
        this.originalThreads = this.$store.getters[
          "forumStore/getThreads"
        ].filter((thread) => thread.quiz_id === this.filterEntity.quizId);
        this.threads = this.originalThreads;
      }
    },
    changeUserId(userId, firstName) {
      this.searchEntity.selectedUser = firstName;
      this.searchEntity.userId = userId;
      this.filterAndSort(this.filterEntity.sortBy);
    },
    changeQuizId(quizId, description) {
      this.filterEntity.selectedQuiz = `${quizId} - ${description}`;
      this.filterEntity.quizId = quizId;
      this.filterAndSort(this.filterEntity.sortBy);
    },
    sort(sortBy) {
      this.filterEntity.sortBy = sortBy;
      if (sortBy === "Latest") {
        this.threads = this.threads.sort(
          (a, b) => moment(b.last_activity) - moment(a.last_activity)
        );
      } else if (sortBy === "Oldest") {
        this.threads = this.threads.sort(
          (a, b) => moment(a.last_activity) - moment(b.last_activity)
        );
      } else {
        this.threads = this.threads.sort((a, b) => b.replies - a.replies);
      }
    },
    filterAndSort(sortBy) {
      this.filter();
      this.sort(sortBy);
      this.paginate();
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
        this.originalThreads,
        changeTo,
        this.pagination.pagesPerPage
      );

      this.threads = paginated.data;
      this.pagination.currentPage = paginated.page;
      this.pagination.prevPage = paginated.pre_page;
      this.pagination.nextPage = paginated.next_page;
    },
  },
};
</script>

<style scoped>
.create-thread {
  position: relative;
  z-index: 1000;
}
.create-thread .btn-dark {
  width: 60px;
  height: 60px;
  font-size: 30px;
  border-radius: 50%;
  padding: 0;
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #0ceb13aa;
  border-color: #2e2e2e;
  display: none;
  z-index: 999;
  -webkit-transition: all 0.3s linear;
  -o-transition: all 0.3s linear;
  transition: all 0.3s linear;
}
.create-thread .btn-dark:hover {
  cursor: pointer;
  background: #fa6742;
  border-color: #fa6742;
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
  border: 1px;
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
  font-weight: bold;
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

#sort-and-filter {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #6356ca;
  color: #eee;
}

.details-wrapper div {
  padding: 1em;
}

#sort-and-filter label {
  font-weight: bold;
  padding-right: 20px;
}

.dropdown-menu {
  background-color: #6356ca;
}

.dropdown-item {
  color: #eee;
}

.dropdown-item:hover {
  color: #111;
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
  .course {
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