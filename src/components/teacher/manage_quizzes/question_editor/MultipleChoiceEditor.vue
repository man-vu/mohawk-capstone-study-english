<template>
  <div class="form-group">
    <label class="control-label" for="question">Question</label>
    <div class="">
      <textarea
        name="question"
        id="question"
        rows="3"
        v-model="question"
        placeholder="Enter your multiple choice question..."
      ></textarea>
    </div>
  </div>
  <div class="form-group">
    <label class="control-label" for="active">Choices (Tick checkboxes that are correct answers)</label>
    <div v-if="items.length > 0">
      <multiple-choice-item
        v-for="item in items"
        :key="item.choice_id"
        :id="item.choice_id"
        :item="item"
        :mode="mode"
        @update="updateItem"
      ></multiple-choice-item>
    </div>
    <div v-else>There is no choice created for this question</div>
  </div>
  <button @click="addChoice" :disabled="mode === 'edit'" class="mb-3 btn btn-primary">Add Choice</button>
  <div class="form-group">
    <button
      type="button"
      @click="closeQuestionEditorModal()"
      class="btn btn-dark"
    >
      Cancel
    </button>
    <button type="button" @click="save" class="ml-3 btn btn-primary">
      Save
    </button>
  </div>
</template>

<script>
import MultipleChoiceItem from "./question_editor_item/MultipleChoiceItem";
export default {
  inject: ["openQuestionEditorModal", "closeQuestionEditorModal", "setQuestionStatusMessages"],
  components: { MultipleChoiceItem },
  emits: ["handleSave"],
  props: ["mode"],
  data() {
    return {
      items: [],
      currentAlphabeticCharacter: "@",
      currentChoiceId: 0,
      question: "",
    };
  },
  methods: {
    nextChar() {
      this.currentAlphabeticCharacter = String.fromCharCode(
        this.currentAlphabeticCharacter.charCodeAt(0) + 1
      );
      return this.currentAlphabeticCharacter;
    },
    addChoice() {
      let index = this.nextChar();
      let currentId = ++this.currentChoiceId;

      this.items.push({
        choice_id: currentId,
        choice_order: index,
        choice_text: "",
        is_correct_choice: 0,
      });
    },
    updateItem(item) {
      let choiceItem = this.items.find((i) => i.choice_id === item.choice_id);
      choiceItem.choice_text = item.choice_text;
      choiceItem.is_correct_choice = item.is_correct_choice === true ? 1 : 0;
    },
    save() {
      if (this.items.every(i => i.is_correct_choice === 0)) {
        this.setQuestionStatusMessages("You must specify at least one correct choice.")
        return
      }

      this.$emit("handleSave", { typeId: 1, items: this.items, question: this.question.replaceAll("\n", '<br>').replaceAll("'", "''"), });
    },
  },
  created() {
    if (this.mode === "edit") {
      const question = this.$store.getters["teacherStore/getEditQuestion"];
      this.items = question.items;
      this.question = question.question.replaceAll("<br>", '\n').replaceAll(`''`, `'`)

      for (const choice of this.items) {
        let index = this.nextChar();
        let currentId = ++this.currentChoiceId;
        choice.choice_order = index;
      }
    }
  },
};
</script>

<style scoped>
label {
  font-weight: 600;
}

button {
  font-weight: 600;
  width: 25%;
}

#instruction,
#question {
  width: 100%;
}
</style>