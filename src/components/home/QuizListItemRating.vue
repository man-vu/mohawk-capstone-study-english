<template>
  <div>
    <div>
      <span>
        <span class="rating-number mr-1">{{ formattedRating }}</span>
        <span v-for="(star, index) in displayedStars" :key="index">
          <font-awesome-icon
            v-if="star === 'regular'"
            class="star"
            :icon="faStarRegular"
            @click="vote(index + 1)"
          ></font-awesome-icon>
          <font-awesome-icon
            v-else-if="star === 'half'"
            class="star"
            :icon="faStarHalfAlt"
            @click="vote(index + 1)"
          ></font-awesome-icon>
          <font-awesome-icon
            v-else
            class="star"
            :icon="faStarSolid"
            @click="vote(index + 1)"
          ></font-awesome-icon>
        </span>

        <span class="vote-number ml-1">({{ ratingCount }})</span>
      </span>
    </div>
    <div v-if="voted">Thanks for voting!</div>
    <div v-if="ratingGiven">You gave {{ratingGiven}} stars</div>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";

export default {
  props: ["rating", "id", "ratingCount", "ratingGiven"],
  components: { FontAwesomeIcon },
  data() {
    return {
      stars: ["regular", "regular", "regular", "regular", "regular"],
      voted: false,
    };
  },
  computed: {
    faStarSolid() {
      return faStarSolid;
    },
    faStarRegular() {
      return faStarRegular;
    },
    faStarHalfAlt() {
      return faStarHalfAlt;
    },
    formattedRating() {
      return !!this.rating ? this.rating.toFixed(1) : this.rating;
    },
    displayedStars() {
      const stars = ["regular", "regular", "regular", "regular", "regular"];

      let lastStar = this.rating % 1;
      let fullStar = parseInt(this.rating);

      let i = 0;
      for (i = 0; i < fullStar; i++) {
        stars[i] = "full";
      }

      if (fullStar < 5) {
        if (lastStar === 1) {
          stars[i] = "full";
        } else if (lastStar >= 0.5) {
          stars[i] = "half";
        } else {
          stars[i] = "regular";
        }
      }

      return stars
    },
  },
  created() {},
  methods: {
    vote(starScore) {
      const isAuthenticated = this.$store.getters["authStore/isAuthenticated"];
      if (isAuthenticated) {
        this.$store
          .dispatch("homeStore/updateRating", {
            id: this.id,
            ratingGiven: starScore,
          })
          .then((response) => {
            
            if (response === "OK") {
              this.voted = true;
            } else {

            }
            
          });
      } else {
      }
    },
  },
};
</script>

<style scoped>
.rating-number {
  font-weight: bold;
}

.star {
  cursor: pointer;
}
</style>