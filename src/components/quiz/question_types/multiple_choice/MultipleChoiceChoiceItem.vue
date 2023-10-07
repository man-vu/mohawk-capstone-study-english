<template>
  <div @click="selectOption" :class="optionClass">
    <a >
      <span :class="letterClass"
        ><p>{{ letter }}</p></span
      >
      <span
        ><p>{{ text }}</p></span
      >
    </a>
  </div>
</template>

<script>
const characters = {
  0: "A",
  1: "B",
  2: "C",
  3: "D",
  4: "E",
  5: "F",
  6: "G",
  7: "H",
  8: "J",
  9: "K",
  10: "L",
};

export default {
  props: ["id", "text", "selectedOptions", "item"],
  computed: {
    letter() {
      return characters[this.id];
    },
    letterClass() {
      return {
        letter: true,
        "letter-selected": this.selectedOptions.includes(this.item.choice_id ),
      };
    },
    optionClass() {
      return {
        option: true,
        "option-selected": this.selectedOptions.includes(this.item.choice_id ),
      }
    },
  },
  setup() {
    return {};
  },
  methods: {
    selectOption() {
      this.$emit("selectOption", this.item.choice_id);
    },
  },
};
</script>

<style scoped>
.option {
  width: 100%;
  height: 60px;
  background-color: #23334b;
  cursor: pointer;
  color: #eee;
}
.option a span:nth-child(2) {
  display: inline-block;
}
.option a span:nth-child(2) p {
  margin: 25px 20px;
  font-family: sans-serif;
}
.option span {
  display: inline-block;
}

.option:hover {
  background-color: #6250e9 !important;
}

.option-selected {
  background-color: rgb(85, 62, 255) !important;
}

.letter {
  width: 40px;
  height: 40px;
  background-color: #3498db;
  text-align: center;
  margin: 5px 10px;
  border-radius: 50%;
  padding-bottom: 5px;
}
.letter p {
  color: white;
  font-family: arial;
  font-size: 16pt;
  line-height: 0;
  font-weight: 600;
  margin-top: 20px;
}

.letter-selected {
  background-color: #a127d5;
}

.borderme {
  border-top: solid 0.75pt #dedede;
}
</style>