<template>
  <div class="letter" :class="letterClass" @click="scrollToQuestion">
    {{ number }}
  </div>
</template>

<script>
export default {
  props: ["question", "number"],
  computed: {
    letterClass() {
      return {
        "letter-selected": this.question.answer_text !== "" ? true : false,
      };
    },
  },
  methods: {
    scrollToQuestion() {
      var container = document.querySelector("#quiz-content").children[this.number - 1];
      if (container) {
          container.scrollIntoView()
      }
      
    },
  },
};
</script>

<style scoped>
.letter {
  width: 40px;
  height: 40px;
  background-color: #3498db;
  text-align: center;
  margin: 5px 10px;
  border-radius: 50%;
  padding-bottom: 5px;
  line-height: 40px;
  color: white;
  font-family: arial;
  font-size: 16pt;
  font-weight: 600;
  cursor: pointer;
}

.letter-selected {
  background-color: #34323f;
  color: #eee;
}
</style>