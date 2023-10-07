<template>
  <header
    :class="{
      headerAuthExpanded: isAuthenticated && expanded,
      headerUnauthExpanded: !isAuthenticated && expanded,
    }"
  >
    <nav
      class="navbar navbar-expand-lg navbar-dark bg-dark"
      :class="{
        navbarAuthExpanded: isAuthenticated && expanded,
        navbarUnauthExpanded: !isAuthenticated && expanded,
      }"
    >
      <button
        ref="navbarToggleButton"
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
        @click="expanded = !expanded"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link to="/home">Home</router-link>
          </li>
          <li class="nav-item disabled" v-if="isAuthenticated">
            <router-link to="/quiz">Quiz</router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <router-link to="/discussion">Discussion</router-link>
          </li>
          <li class="nav-item" v-if="isAuthenticated">
            <router-link to="/statistics">Statistics</router-link>
          </li>
          <li class="nav-item" v-if="isTeacher">
            <router-link to="/teacher">Teacher Area</router-link>
          </li>
        </ul>
        <ul>
          <li v-if="!isAuthenticated">
            <router-link to="/register">Register</router-link>
          </li>
          <li v-if="!isAuthenticated">
            <router-link to="/login">Login</router-link>
          </li>

          <li v-if="isAuthenticated">
            <img
              class="profile-image"
              :src="`https://learningenglishapp-assets.s3-us-west-1.amazonaws.com/avatars/${avatarUrl}`"
              alt=""
            />
          </li>
          <li v-if="isAuthenticated" class="nav-item dropdown ml-2 mr-3">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="navbarDropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              Hi, {{ authenticatedUser }}
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
              <router-link class="dropdown-item" to="/settings"
                >Account Settings</router-link
              >
              <router-link class="dropdown-item" @click="signOut" to="/logout"
                >Sign out</router-link
              >
            </div>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import path from "path";
import {avatar} from "../common/helper"

export default {
  data() {
    return {
      publicPath: process.env.BASE_URL,
      expanded: false,
    };
  },
  watch: {},
  created() {
    window.addEventListener("resize", this.windowResizeHandler);
    console.log(this.publicPath);
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters["authStore/isAuthenticated"];
    },
    isTeacher() {
      return this.$store.getters["authStore/isTeacher"];
    },
    authenticatedUser() {
      return this.$store.getters["authStore/getAuthenticatedUser"];
    },
    avatarUrl() {
      return localStorage.getItem("avatarUrl");
    },
  },
  methods: {
    windowResizeHandler() {
      const width = document.documentElement.clientWidth;

      if (width > 890 && this.expanded === true) {
        this.$refs.navbarToggleButton.click();
      }
    },
    signOut() {
      this.$store.dispatch("signOut");
    },
  },
};
</script>

<style scoped>
.dropdown-menu {
  background-color: #6356ca;
}

.dropdown-item {
  color: #eee !important;
}

header {
  width: 100%;
  height: 5rem;
  background-color: #11005c;
}

nav {
  height: 100%;
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
  height: 100%;
  display: flex;
  /* justify-content: center;
  align-items: center; */
}

li {
  /* margin: 0 2rem; */
}

a {
  text-decoration: none;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  color: white;
  padding: 0.5rem 1.5rem;
  display: inline-block;
}

.dropdown-menu a {
  color: #222;
}

a:hover,
a:active,
a.active {
  color: #f1a80a;
  border-color: #f1a80a;
  background-color: #1a037e;
}

.profile-image {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  header {
    position: sticky;
    top: 0;
    z-index: 1000;
  }

  .headerAuthExpanded {
    margin-bottom: 255px !important;
    transition: all 0.5s ease;
  }

  .navbarAuthExpanded {
    padding-bottom: 325px !important;
    transition: all 0.5s ease;
  }

  .headerUnauthExpanded {
    margin-bottom: 70px !important;
    transition: all 0.5s ease;
  }

  .navbarUnauthExpanded {
    padding-bottom: 140px !important;
    transition: all 0.5s ease;
  }
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
  .headerAuthExpanded {
    margin-bottom: 255px !important;
    transition: all 0.5s ease;
  }

  .navbarAuthExpanded {
    padding-bottom: 325px !important;
    transition: all 0.5s ease;
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
}
</style>