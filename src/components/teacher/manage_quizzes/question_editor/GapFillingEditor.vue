<template>
  <div class="form-group">
    <label class="control-label" for="paragraph-title">Paragraph Title</label>
    <input type="text" class="form-control" v-model="paragraphTitle" 
    placeholder="Enter paragraph title..." />
  </div>
  <div class="form-group">
    <div class="label-button-group">
      <label class="control-label" for="question">Question</label>
      <button @click="createGap" :disabled="mode === 'edit'"  class="mb-3 btn btn-primary"> Create Gap </button>
    </div>
    <div class="">
      <textarea name="question" id="question" rows="10" :disabled="mode === 'edit'"  v-model="question" placeholder="Enter your gap filling question..." ></textarea>
    </div>
  </div>
  <div class="form-group">
    <label class="control-label" for="active">Key Answer</label>
    <div v-if="items.length > 0">
      <gap-filling-choice-item v-for="item in items"
        :key="item.sequence_id"
        :id="item.sequence_id"
        :item="item"
        :mode="mode"
        @updateAnswer="updateAnswer"
      ></gap-filling-choice-item>
    </div>
    <div v-else>There is no gap created for this question</div>
  </div>
  <div class="form-group">
    <button type="button" @click="closeQuestionEditorModal()" class="btn btn-dark" > Cancel </button>
    <button type="button" @click="save" class="ml-3 btn btn-primary"> Save </button>
  </div>
</template>

<script>
import GapFillingChoiceItem from "./question_editor_item/GapFillingChoiceItem";

export default {
  emits: ["handleSave"],
  props: ["mode"],
  inject: ["openQuestionEditorModal", "closeQuestionEditorModal", "setStatusMessages"],
  components: { GapFillingChoiceItem },
  watch: {},
  data() {
    return {
      question: "",
      paragraphTitle: "",
      currentGapNumber: 0,
      items: [],
    };
  },
  methods: {
    createGap() {
      this.currentGapNumber += 1;
      this.question += `{${this.currentGapNumber}}`;
      this.items.push({ sequence_id: this.currentGapNumber, correct_answer: "" });
    },
    updateAnswer(index, keyAnswer) {
      let gapItem = this.items.find((i) => i.sequence_id === index);
      gapItem.correct_answer = keyAnswer;
    },
    save() {
      
      this.$emit("handleSave", { typeId: 2, items: this.items, question: this.question.replaceAll("\n", '<br>').replaceAll("'", "''"), paragraphTitle: this.paragraphTitle});
    },
  },
  created() {
    if (this.mode === "edit") {
      const question = this.$store.getters["teacherStore/getEditQuestion"];
      this.items = question.items
      this.paragraphTitle = question.paragraph_title
      this.question = question.question.replaceAll("<br>", '\n').replaceAll(`''`, `'`)
    }
  },
};
</script>

<style scoped>
label {
  font-weight: 600;
}

#instruction,
#question {
  width: 100%;
}

.label-button-group {
  display: flex;
  justify-content: space-between;
}

button {
  font-weight: 600;
  width: 25%;
}
</style>