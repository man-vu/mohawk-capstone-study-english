<template>
  <div class="form-group row">
    <div class="col-1">
      <label class="col-form-label" for="leftColumn">{{ item.letter }}</label>
    </div>
    <div class="col-7">
      <input
        type="text"
        class="form-control"
        placeholder="Matching column"
        v-model="rightColumnText"
        @keyup="updateItem"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: ["id", "item", "mode"],
  data() {
    return {
      rightColumnText: this.mode === "create" ? "" : this.item.text,
    };
  },
  methods: {
    updateItem() {
      this.$emit("update", {
        letter: this.item.letter,
        item: this.rightColumnText.replaceAll("'", "''"),
      });
    },
  },
};
</script>

<style scoped>
</style>