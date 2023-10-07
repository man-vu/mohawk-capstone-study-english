<template>
  <p>{{id}} . {{ item.item.text }}</p>
</template>

<script>
export default {
  props: ["id","item"],
  created() {
    console.log(this.item)
  }
};
</script>

<style scoped>
p {
    padding: 0;
    margin: 0;
    font-size: 14pt;
}
</style>