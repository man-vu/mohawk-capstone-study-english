<template>
  <div class="form-group row">
    <div class="col-1">
      <label class="col-form-label" for="leftColumn">{{ item.choice_order }}</label>
    </div>

    <div class="col-7">
      <input
        type="text"
        class="form-control"
        placeholder="Add choice description"
        v-model="choiceText"
        @keyup="update"
        required
      />
    </div>

    <div class="col-2">
      <input type="checkbox" class="form-control" v-model="checked" @change="update" />
    </div>
  </div>
</template>

<script>
export default {
  props: ["id", "item", "mode"],
  data() {
    return {
      checked: false,
      choiceText: "",
    };
  },
  methods: {
    update() {
      this.$emit("update", {
        choice_id: this.id,
        choice_text: this.choiceText.replaceAll("'", "''"),
        is_correct_choice: this.checked,
      });
    },
  },
  created() {
    if (this.mode === "edit") {
      this.checked = this.item.is_correct_choice === 1 ? true : false
      this.choiceText = this.item.choice_text
    }
    console.log(this.item)
  }
};
</script>

<style lang="scss" scoped>
</style>