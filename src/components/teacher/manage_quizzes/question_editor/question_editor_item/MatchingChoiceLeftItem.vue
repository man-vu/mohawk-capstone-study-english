<template>
  <div class="form-group row">
    <div class="col-1">
      <label class="col-form-label" for="leftColumn">{{ item.letter }}</label>
    </div>
    <div class="col-7">
      <input type="text" class="form-control" placeholder="Starting Column" v-model="leftColumnText" @keyup="updateItem"/>
    </div>
    <div class="col-1"></div>
    <div class="col-3">
      <select class="form-control" name="matching-options" v-model="selectedOption" @change="updateItem">
        <option v-for="option in availableOptions" :key="option.letter">{{ option.letter }}</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: ["letter", "item", "correct_answer", "availableOptions", "mode"],
  data () {
    return {
      leftColumnText: this.mode === "create" ? "" : this.item.text,
      selectedOption: this.mode === "create" ? null : this.item.correct_answer,
    }
  },
  methods: {
    updateItem() {
      this.$emit("update", { letter: this.item.letter, item: this.leftColumnText.replaceAll("'", "''"), correct_answer: this.selectedOption})
    }
  }
};
</script>

<style scoped>
</style>