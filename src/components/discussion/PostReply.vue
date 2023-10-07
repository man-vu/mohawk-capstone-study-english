<template>
  <div id="post-reply" class="container mt-50 card-body">
    <div class="row">
      <div class="col-md-6"></div>
    </div>
    <div class="create__section create__textarea">
      <textarea
        class="form-control"
        id="description"
        rows="5"
        placeholder="Type your reply here..."
        v-model="content"
      ></textarea>
    </div>
    <div
      class="card-footer d-flex flex-wrap justify-content-between align-items-center px-0 pt-0 pb-3"
    >
      <div class="px-4 pt-3"></div>
      <div class="px-4 pt-3">
        <button @click="cancel" type="button" class="btn btn-dark">
          <i class="ion ion-md-create"></i>&nbsp; Cancel
        </button>
        <button @click="submit" type="button" class="btn btn-primary ml-3">
          <i class="ion ion-md-create"></i>&nbsp; Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["threadId"],
  data() {
    return {
      content: "",
    };
  },
  methods: {
    cancel() {
      this.content = "";
    },
    submit() {
      const threadId = this.threadId
      const content = this.content.replaceAll("\n", '<br>').replaceAll("'", "''")


      this.$store.dispatch('forumStore/createPost', {threadId, content})
    },
  },
};
</script>

<style lang="scss" scoped>
</style>