<template>
  <the-navigation></the-navigation>
  <main>
    <router-view></router-view>
  </main>
  <the-footer>
    <router-view name="footer"></router-view>
  </the-footer>
</template>

<script>
import TheNavigation from "./components/nav/TheNavigation.vue";
import TheFooter from "./components/footer/TheFooter";

export default {
  components: {
    TheNavigation,
    TheFooter,
  },
  watch: {
    $route: {
      immediate: true,
      handler(to, from) {
        document.title = to.meta.title ? `${to.meta.title} | Learning English App` : "Learning English App";
      },
    },
  },
};
</script>

<style>
* {
  box-sizing: border-box;
}

html {
  font-family: sans-serif;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  background-color: #1c2431;
  color: #eee;
}
</style>