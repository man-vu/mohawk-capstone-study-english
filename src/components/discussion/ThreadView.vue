<template>
  <div class="container mt-100">
    <div class="row">
      <div class="col-md-12">
        <div class="card mb-4">
          <div class="card-header p-3">
            <div class="media flex-wrap w-100 align-items-center">
              <img
              :src="`https://learningenglishapp-assets.s3-us-west-1.amazonaws.com/avatars/${thread.avatarUrl}`"
                class="d-block ui-w-40 rounded-circle"
                alt=""
              />
              <div class="media-body ml-3">
                <a href="javascript:void(0)" data-abc="true">{{
                  thread.full_name
                }}</a>
                <div class="small">
                  {{ displayedThreadCreatedAt }} ago
                </div>
              </div>
              <div class="small ml-3">
                <div>
                  Member since <strong>{{ displayedMemberSince }}</strong>
                </div>
                <div>
                  <strong>{{ thread.thread_count }}</strong>
                  {{ thread.thread_count === 1 ? "thread" : "threads" }}
                  <strong>{{ thread.post_count }}</strong>
                  {{ thread.post_count === 1 ? "post" : "posts" }}
                </div>
              </div>
            </div>
          </div>
          <div class="card-header thread-subject pt-3 pb-3">{{ thread.subject }}</div>
          <div class="card-body" v-html="thread.content"></div>
          <div
            class="card-footer d-flex flex-wrap justify-content-between align-items-center px-0 pt-0 pb-3"
          >
            <div class="px-4 pt-3"></div>
            <div class="px-4 pt-3">
              <button type="button" class="btn btn-primary" @click="reply">
                <i class="ion ion-md-create"></i>&nbsp; Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="pagination.totalPages !== null && thread.posts.length > 0" class="block-27 text-right">
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
          thread.posts.length
        }}</span>
        out of
        <span class="badge badge-pill badge-secondary">{{
          thread.originalPosts.length
        }}</span>
        posts in total
      </p>
    </div>
    <discussion-forum-post-item
      v-for="p in thread.posts"
      :key="p.post_id"
      :p="p"
    >
    </discussion-forum-post-item>
    <div v-if="pagination.totalPages !== null && thread.posts.length > 0" class="block-27 text-right">
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
          thread.posts.length
        }}</span>
        out of
        <span class="badge badge-pill badge-secondary">{{
          thread.originalPosts.length
        }}</span>
        posts in total
      </p>
    </div>
  </div>

  <post-reply :threadId="thread.thread_id"></post-reply>

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
</template>

<script>
import PostReply from "./PostReply";
import DiscussionForumPostItem from "./DiscussionForumPostItem";
import {
  truncate,
  timeSince,
  convertISOToReadableFormat,
} from "../common/helper";
import { paginator } from "../common/helper";
import DialogModal from "../common/DialogModal"

export default {
  components: { PostReply, DiscussionForumPostItem },
  data() {
    return {
      thread: {
        originalPosts: [],
      },
      pagination: {
        currentPage: 1,
        totalPages: null,
        pagesPerPage: 10,
        nextPage: null,
        prevPage: null,
      },
      showDialogModal: false
    };
  },
  computed: {
    displayedMemberSince() {
      if (this.thread.member_since) {
        return this.convertISOToReadableFormat(
          new Date(this.thread.member_since)
        );
      }
      return null;
    },
    publicPath() {
      return process.env.BASE_URL
    },
    displayedThreadCreatedAt() {
      return this.timeSince(new Date(this.thread.created_at));
    },
  },
  created() {
    this.truncate = truncate;
    this.timeSince = timeSince;
    this.convertISOToReadableFormat = convertISOToReadableFormat;

    let threadId = this.$route.params.id;

    

    this.$store
      .dispatch("forumStore/getDataForDiscussionThread", { threadId })
      .then((response) => {
        this.thread = this.$store.getters["forumStore/getCurrentThread"];
        this.thread.originalPosts = this.thread.posts;
        console.log(this.thread.avatarUrl)
        this.paginate();
      });
  },
  methods: {
    reply() {
      var container = document.querySelector("#post-reply")
      if (container) {
        container.scrollIntoView();
      }
    },
    paginate(currentPage, pagesPerPage) {
      const paginated = paginator(
        this.thread.posts,
        currentPage || this.pagination.currentPage,
        pagesPerPage || this.pagination.pagesPerPage
      );

      this.thread.posts = paginated.data;
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
        this.thread.originalPosts,
        changeTo,
        this.pagination.pagesPerPage
      );

      this.thread.posts = paginated.data;
      this.pagination.currentPage = paginated.page;
      this.pagination.prevPage = paginated.pre_page;
      this.pagination.nextPage = paginated.next_page;
    },
  },
};
</script>

<style scoped>
.page-number {
  cursor: pointer;
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
  background: #2a265f;
  color: #fff;
  border: 1px solid transparent;
}

.mt-100 {
  margin-top: 100px;
}

.card {
  box-shadow: 0 0.46875rem 2.1875rem rgba(4, 9, 20, 0.03),
    0 0.9375rem 1.40625rem rgba(4, 9, 20, 0.03),
    0 0.25rem 0.53125rem rgba(4, 9, 20, 0.05),
    0 0.125rem 0.1875rem rgba(4, 9, 20, 0.03);
  border-width: 0;
  transition: all 0.2s;
}

.card-header:first-child {
  border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
}

.card-header {
  display: flex;
  align-items: center;
  border-bottom-width: 1px;
  padding-top: 0;
  padding-bottom: 0;
  padding-right: 0.625rem;
  text-transform: uppercase;
  background-color: #6356ca;
  color: #eee;
  border-bottom: 1px solid rgba(26, 54, 126, 0.125);
}

.btn-primary {
  color: #fff;
  background-color: #3f6ad8;
  border-color: #3f6ad8;
}

.btn {
  font-size: 0.8rem;
  font-weight: 500;
  outline: none !important;
  position: relative;
  transition: color 0.15s, background-color 0.15s, border-color 0.15s,
    box-shadow 0.15s;
}

.card-body {
  flex: 1 1 auto;
  padding: 2rem;
  color: #111;
  
}

.card-footer {
  background-color: #6356ca;
}

.card-body p {
  font-size: 16px;
}

a {
  color: #59ed3b;
  text-decoration: none !important;
  background-color: transparent;
}

.media img {
  width: 40px;
  height: auto;
}

.thread-subject {
  font-weight: 600;
}
</style>