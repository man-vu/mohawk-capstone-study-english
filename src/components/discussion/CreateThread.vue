<template>
  <main>
    <div class="container">
      <div class="create">
        <div class="create__head">
          <div class="create__title">
            <i class="fa fa-plus"></i>&nbsp;Create New Thread
          </div>
        </div>
        <div v-if="errorMessage" class="alert alert-danger mt-3">
          {{ errorMessage }}
        </div>
        <div class="create__section">
          <label class="create__label" for="title">Thread Title</label>
          <input
            type="text"
            class="form-control"
            id="title"
            placeholder="Thread Subject"
            v-model="subject"
            required
          />
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="create__section">
              <label class="create__label" for="category"
                >Select Related Quiz</label
              >
              <select
                class="custom-select"
                id="category"
                v-model="selectedRelatedQuiz"
                required
              >
                <option value="none">Please choose a related quiz</option>
                <option
                  v-for="q in quizzes"
                  :key="q.quiz_id"
                  :value="q.quiz_id"
                >
                  Quiz {{ q.quiz_id }} - {{ q.description }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-6"></div>
        </div>
        <div class="create__section create__textarea">
          <label class="create__label" for="description">Description</label>
          <textarea
            class="form-control"
            id="description"
            v-model="description"
            placeholder="Add your description here"
            required
          ></textarea>
        </div>
        <div class="create__footer">
          <a href="#" @click="cancel" class="create__btn-cansel btn btn-secondary"
            >Cancel</a
          >
          <a
            href="#"
            @click="createThread"
            class="create__btn-create btn btn-primary"
            >Create Thread</a
          >
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      subject: "",
      selectedRelatedQuiz: "none",
      description: "",
      errorMessage: "",
      error: false,
      isLoading: true,
      quizzes: [],
    };
  },
  methods: {
    cancel() {
      this.$router.push("./discussion");
    },
    createThread() {
      if (this.selectedRelatedQuiz === "none") {
        this.error = true;
        this.errorMessage = "Please select a related quiz";
        return;
      }

      if (this.subject.length < 10) {
        this.error = true;
        this.errorMessage =
          "Thread subject must be longer than 10 characters";
        return;
      }

      if (this.description.length < 10) {
        this.error = true;
        this.errorMessage = "Description must be longer than 10 characters";
        return;
      }

      this.error = false;
      this.errorMessage = "";
      
      this.$store
        .dispatch("forumStore/createThread", {
          subject: this.subject,
          selectedRelatedQuizId: this.selectedRelatedQuiz,
          description: this.description.replaceAll("\n", '<br>').replaceAll("'", "''"),
        })
        .then((response) => {
          this.$router.push({
            name: "threads.index",
            params: { id: response.newThreadId },
          });
        });
    },
  },
  computed: {},
  created() {
    this.$store.dispatch("forumStore/getDataForDiscussion").then((response) => {
      this.isLoading = false;
      this.quizzes = this.$store.getters["forumStore/getQuizzes"];
    });
  },
};
</script>

<style scoped>
.create {
  background-color: #6356ca;
  border: solid 1px #f3f4f5;
}
@media only screen and (min-width: 1040px) {
  .create {
    padding: 20px 30px 30px;
    margin-top: 44px;
  }
}
@media only screen and (max-width: 1039px) {
  .create {
    padding: 20px 20px;
    margin-top: 15px;
  }
}

@media only screen and (min-width: 1040px) {
  .create input.form-control {
    height: 48px;
    padding: 8px 20px;
    font-size: 16px;
  }
}
@media only screen and (max-width: 1039px) {
  .create input.form-control {
    height: 38px;
    padding: 8px 15px;
    font-size: 14px;
  }
}
.create textarea.form-control {
  height: 190px;
  font-size: 16px;
  border: solid 1px #e9ecee;
  border-radius: 0;
  background-color: #f8f9fa;
  color: #8e9091;
  resize: none;
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
}
@media only screen and (min-width: 1040px) {
  .create textarea.form-control {
    padding: 14px 20px;
    font-size: 16px;
  }
}
@media only screen and (max-width: 1039px) {
  .create textarea.form-control {
    padding: 14px 15px;
    font-size: 14px;
  }
}
.create .custom-select {
  display: block;
}
.create .custom-select::after {
  right: 20px;
}
.create .custom-select select {
  display: block;
  width: 100%;
  border: solid 1px #e9ecee;
  background-color: #f8f9fa;
  color: #8e9091;
}
@media only screen and (min-width: 1040px) {
  .create .custom-select select {
    height: 48px;
    padding: 8px 20px;
    font-size: 16px;
  }
}
@media only screen and (max-width: 1039px) {
  .create .custom-select select {
    height: 38px;
    padding: 8px 15px;
    font-size: 14px;
  }
}
.create__head {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: solid 1px #e9ecee;
  align-items: center;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}

.create__head > span {
  margin-left: auto;
  color: #8e9091;
}
.create__title {
  font-weight: 600;
}
.create__title img {
  width: 28px;
  margin-right: 15px;
}
.create__label {
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
}
@media only screen and (max-width: 1039px) {
  .create__label {
    display: none;
  }
}
.create__section {
  margin-bottom: 24px;
}
.create__textarea-head {
  position: relative;
  border: solid 1px #e9ecee;
  border-bottom: none;
  overflow: hidden;
  flex-wrap: wrap;
  align-items: center;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}
@media only screen and (min-width: 1040px) {
  .create__textarea-head {
    min-height: 80px;
    padding: 18px 20px;
  }
}
@media only screen and (max-width: 1039px) {
  .create__textarea-head {
    padding: 0 15px;
  }
}
@media only screen and (max-width: 1039px) {
  .create__textarea-head::before {
    content: "";
    position: absolute;
    display: block;
    width: 100%;
    height: 39px;
    top: 38px;
    left: 0;
    border-top: solid 1px #e9ecee;
    border-bottom: solid 1px #e9ecee;
  }
}
.create__textarea-head span {
  position: relative;
  cursor: pointer;
  align-items: center;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}
@media only screen and (min-width: 1040px) {
  .create__textarea-head span {
    margin-right: 30px;
  }
}
@media only screen and (max-width: 1039px) {
  .create__textarea-head span {
    height: 38px;
    margin-right: 20px;
  }
}
.create__textarea-head i {
  color: #5c6166;
}
@media only screen and (min-width: 1040px) {
  .create__textarea-head i {
    font-size: 18px;
  }
}
@media only screen and (max-width: 1039px) {
  .create__textarea-head i {
    font-size: 16px;
  }
}
.create__textarea-head i.icon-Horizontal_Line {
  font-size: 1px;
}
@media only screen and (min-width: 1040px) {
  .create__textarea-separate {
    height: 18px;
    border-left: solid 1px #e9ecee;
  }
}
@media only screen and (max-width: 1039px) {
  .create__textarea-separate {
    display: none !important;
  }
}
.create__textarea-btn {
  margin-left: auto;
}
@media only screen and (max-width: 1039px) {
  .create__textarea-btn {
    margin-right: -15px;
  }
}
.create__advanced {
  margin-bottom: 30px;
  border-bottom: solid 1px #e9ecee;
}
@media only screen and (max-width: 1039px) {
  .create__advanced {
    display: none;
  }
}

.create__footer {
  flex-wrap: wrap;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
}
@media only screen and (min-width: 1040px) {
  .create__footer .btn {
    width: 140px;
  }
}
.create__btn-cansel {
  margin-right: 15px;
}
@media only screen and (min-width: 1040px) {
  .create__btn-cansel {
    margin-left: auto;
  }
}
@media only screen and (max-width: 1039px) {

}
@media only screen and (max-width: 1039px) {
  .create__btn-create {
    margin-left: auto;
  }
}

.custom-select {
  position: relative;
}
.custom-select select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.custom-select::after {
  content: "";
  position: absolute;
  display: block;
  margin-top: -5px;
  top: 50%;
  border-bottom: solid 1px #81858a;
  border-right: solid 1px #81858a;
  width: 7px;
  height: 7px;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  transform: rotate(45deg);
}
@media only screen and (min-width: 1040px) {
  .custom-select::after {
    right: 15px;
  }
}
@media only screen and (max-width: 1039px) {
  .custom-select::after {
    right: 12px;
  }
}
</style>