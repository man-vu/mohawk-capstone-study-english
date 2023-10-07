<template>
  <div class="form-group row">
    <div class="col-8">
      <label class="col-form-label" for="leftColumn"
        >{{ id }} . {{ item.text }}</label
      >
    </div>
    <div class="col-4">
      <select
        class="form-control"
        name="matching-options"
        v-model="selected"
        @change="updateResponse"
      >
        <option selected value="">Select an option</option>
        <option v-for="option in availableOptions" :key="option.id">
          {{ option.id }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id", "item", "selectedOption", "availableOptions"],
  data() {
    return {
      selected: this.selectedOption ? this.selectedOption : "",
    };
  },
  methods: {
    updateResponse() {
      this.$emit("updateResponse", this.id, this.selected);
    },
  },
  created() {
    console.log(this.item);
  },
};
</script>

<style scoped>
label {
  font-size: 14pt;
}
</style>