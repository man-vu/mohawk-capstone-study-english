<template>
  <div>
    <h1>You have signed out successfully</h1>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '../../stores/authStore';
export default {
  setup() {
    return {};
  },
  mounted() {
    const auth = useAuthStore();
    auth.signOut();
    this.$router.push({ name: "home" });
  },
};
</script>

<style scoped>
</style>