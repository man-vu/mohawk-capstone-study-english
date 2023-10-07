<template>
  <div>
    <h1>You have signed out successfully</h1>
  </div>
</template>

<script>
export default {
  setup() {
    return {};
  },
  mounted() {
    this.$store.dispatch("authStore/signOut");
    this.$router.push({ name: "home" });
  },
};
</script>

<style scoped>
</style>