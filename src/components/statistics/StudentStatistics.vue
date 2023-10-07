<template>
  <div v-if="!isTeacher">
    <div v-if="!isLoading" id="chartArea" class="mt-5">
      <span v-if="statistics.quizStatistics" class="chart">
        <apexchart
          width="500"
          type="pie"
          :options="statistics.quizStatistics.chartOptions"
          :series="statistics.quizStatistics.data"
        ></apexchart>
      </span>
      <h3 v-else>
        No data about quiz statistics has been found about this user
      </h3>

      <span v-if="statistics.answerStatistics" class="chart">
        <apexchart
          width="500"
          type="pie"
          :options="statistics.answerStatistics.chartOptions"
          :series="statistics.answerStatistics.data"
        ></apexchart>
      </span>
      <h3 v-else>
        No data about answer statistics has been found about this user
      </h3>
    </div>
    <div v-else>
      <h1>Loading data...</h1>
    </div>
  </div> 
  <div class="container" v-else>
    <h1 >Teacher is not allowed to access statistics.</h1>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  computed: {
    isTeacher() {
      return this.$store.getters["authStore/isTeacher"];
    },
  },
  data() {
    return {
      isLoading: false,
    };
  },
  created() {
    this.isLoading = true;
    this.$store.dispatch("statisticsStore/loadData").then(() => {
      this.isLoading = false;
      this.statistics = this.$store.getters["statisticsStore/getStatistics"];
    });
  },
};
</script>

<style scoped>
#chartArea {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-bottom: 50px;
}

.chart {
  border: 1px solid #000;
}

@media screen and (max-width: 400px) {
  #chartArea {
    display: flex;
    flex-direction: column;
  }
  .chart {
    margin-top: 2rem;
  }
}

@media screen and (max-width: 768px) {
  #chartArea {
    display: flex;
    flex-direction: column;
  }
  .chart {
    margin-top: 2rem;
  }
}
</style>