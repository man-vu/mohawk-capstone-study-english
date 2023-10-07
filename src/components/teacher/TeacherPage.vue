<template>
  <div class="wrapper">
    <!-- Sidebar  -->
    <nav id="sidebar">
      <div class="sidebar-header">
        <h3>Teacher Panel</h3>
      </div>

      <ul class="list-unstyled components">
        <li @click="switchTab(0)">
          <a :class="{selectedTab: selectedTab === 0}" href="#">Manage Quizzes</a>
        </li>
        <li @click="switchTab(1)">
          <a :class="{selectedTab: selectedTab === 1}" href="#">Board Statistics</a>
        </li>
      </ul>
    </nav>

    <!-- Page Content  -->
    <div id="content" :class="contentPadding">
      <component :is="renderComponent"></component>
    </div>
  </div>
</template>

<script>
import BoardStatistics from "./BoardStatistics";
import ManageQuizzes from "./ManageQuizzes";

export default {
  computed: {
    renderComponent: function () {
      switch (this.selectedTab) {
        case 0:
          return ManageQuizzes;
        case 1:
          return BoardStatistics;
        default:
          return null;
      }
    },
    contentPadding: function () {
        return {
          "content-padding": true,
        };
    },
  },
  data() {
    return {
      selectedTab: 0,
    };
  },
  methods: {
    switchTab: function (tabIndex) {
      this.selectedTab = tabIndex;
    },
  },
};
</script>

<style scoped>
@import "https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700";
body {
  font-family: "Poppins", sans-serif;
  background: #fafafa;
}

p {
  font-family: "Poppins", sans-serif;
  font-size: 1.1em;
  font-weight: 300;
  line-height: 1.7em;
  color: #999;
}

a,
a:hover,
a:focus {
  color: inherit;
  text-decoration: none;
  transition: all 0.3s;
}

.navbar {
  padding: 15px 10px;
  background: #fff;
  border: none;
  border-radius: 0;
  margin-bottom: 40px;
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
}

.navbar-btn {
  box-shadow: none;
  outline: none !important;
  border: none;
}

.line {
  width: 100%;
  height: 1px;
  border-bottom: 1px dashed #ddd;
  margin: 40px 0;
}

.wrapper {
  display: flex;
  width: 100%;
  align-items: stretch;
}

/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
  #sidebar {
    max-width: unset !important;
    min-width: unset !important;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: space-between;
  }
}

@media only screen and (max-width: 768px) {
  #sidebar {
    max-width: unset !important;
    min-width: unset !important;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: space-between;
  }
}

#sidebar {
  min-width: 250px;
  max-width: 250px;
  background: #6356ca;
  color: #fff;
  transition: all 0.3s;
}

#sidebar.active {
  margin-left: -250px;
}

#sidebar .sidebar-header {
  padding: 20px;
  background: #5d51bd;
}

#sidebar ul.components {
  padding: 0px 0;
  border-bottom: 1px solid #47748b;
}

#sidebar ul p {
  color: #fff;
  padding: 10px;
}

#sidebar ul li {
  list-style-type: none;
}

#sidebar ul li a {
  padding: 10px;
  font-size: 1.1em;
  display: block;
}

#sidebar ul li a:hover {
  color: #7386d5;
  background: #fff;
}

.selectedTab {
  color: #7943e4 !important;
  background: rgba(255, 255, 255, 0.975);
}

#sidebar ul li.active > a,
a[aria-expanded="true"] {
  color: #fff;
  background: #6d7fcc;
}

a[data-toggle="collapse"] {
  position: relative;
}

.dropdown-toggle::after {
  display: block;
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
}

ul ul a {
  font-size: 0.9em !important;
  padding-left: 30px !important;
  background: #6d7fcc;
}

#content {
  width: 100%;
  min-height: 100vh;
  transition: all 0.3s;
}

.content-padding {
  padding: 20px;
}
</style>