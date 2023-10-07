<template>
  <div v-if="isAuthenticated">
    <font-awesome-icon v-if="favorite" class="favorite" :icon="faStarSolid" @click="toggleFavorite()"></font-awesome-icon>
    <font-awesome-icon v-else class="favorite" :icon="faStarRegular" @click="toggleFavorite()"></font-awesome-icon>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";

export default {
  components: { FontAwesomeIcon },
  props: ["favorite", "id"],
  computed: {
    faStarSolid() {
      return faStarSolid;
    },
    faStarRegular() {
      return faStarRegular;
    },
    isAuthenticated() {
      return this.$store.getters["authStore/isAuthenticated"];
    },
  },
  data() {
    return {
      star: this.favorite ? faStarSolid : faStarRegular,
    };
  },
  methods: {
    toggleFavorite: function () {
      if (this.isAuthenticated) {
        this.$store
          .dispatch("homeStore/toggleFavorite", {
            id: this.id,
          })
          .then((response) => {
            this.star = faStarSolid;
          });
      } else {
      }
    },
  },
};
</script>

<style scoped>
.favorite {
  cursor: pointer;
}
</style>