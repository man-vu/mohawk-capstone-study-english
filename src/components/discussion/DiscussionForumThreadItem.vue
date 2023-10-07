<template>
  <div class="row">
    <div class="cell" data-title="Topic"> 

      <span class="subject"><a @click="navigateToThread(t.thread_id)"> {{ displayedSubject }} </a></span><br>
      <span></span>{{ displayedThreadContent }}  
      </div>
    <div class="cell" data-title="Related Quiz Id">Quiz {{ t.quiz_id }}</div>
    <div class="cell" data-title="Users">
      <a href="#" class="avatar" ><img class="avatar" :src="`https://learningenglishapp-assets.s3-us-west-1.amazonaws.com/avatars/${t.thread_starter_avatar_url}`" alt="avatar" data-dropdown-btn="user-b"
      /></a>
    </div>
    <div class="cell" data-title="Number of replies">{{ t.replies }}</div>
    <div class="cell" data-title="Last Activity">{{ displayedLastActivity }} ago</div>
  </div>
</template>

<script>
import { truncate, timeSince } from "../common/helper";

export default {
  props: ["t"],
  computed: {
    displayedSubject() {
      return this.truncate(this.t.subject, 50);
    },
    displayedThreadContent() {
      const htmlElement = new DOMParser().parseFromString(this.t.content, "text/html")
      return this.truncate(htmlElement.documentElement.innerText, 55);
    },
    displayedLastActivity() {
      return this.timeSince(new Date(this.t.last_activity));
    },
    publicPath() {
      return process.env.BASE_URL;
    },
  },
  methods: {
    navigateToThread: function (threadId) {
      this.$router.push({
        name: "threads.index",
        params: { id: threadId },
      });
    },
  },
  created() {
    this.truncate = truncate;
    this.timeSince = timeSince;
  },
};
</script>

<style scoped>
.posts__title {
  cursor: pointer;
}

.avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}



.subject {
  font-weight: bold;
}

.subject:hover {
  color: #988ee6;
}

td { white-space:pre-line }

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
  font-weight: 900;
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

a {
  cursor: pointer;
}
</style>