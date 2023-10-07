<template>
  <div class="form-group">
    <label class="control-label" for="instruction">Gap {{ id }}</label>
    <input
      type="text"
      class="form-control col-4"
      name="active"
      v-model="answer"
      @keyup="updateResponse"
    />
  </div>
</template>

<script>
export default {
    props: ["id", "response"],
    data() {
        return {
            answer: this.response
        }
    },
    methods: {
      updateResponse() {
        this.$emit("updateResponse", this.id, this.answer)
      }
    }
};
</script>

<style scoped>
label {
  font-weight: bold;
}
</style>