<template>
  <div class="form-group">
    <label class="control-label" for="instruction">Gap {{ id }}</label>
    <input type="text" class="form-control col-4" name="active" v-model="keyAnswer" @keyup="update" />
  </div>

</template>

<script>
export default {
  props: ["id", "item", "mode"],
  data() {
    return {
      keyAnswer: this.mode === "create" ? "" : this.item.correct_answer,
    };
  },
  methods: {
    update: function () {
      this.$emit("updateAnswer", this.id, this.keyAnswer.replaceAll("'", "''"));
    },
  },
};
</script>

<style scoped>
label {
    font-weight: bold;
}
</style>