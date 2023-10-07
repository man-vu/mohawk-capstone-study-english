<template>
  <div v-if="!isLoading" id="chartArea" class="mt-5">
    <span v-if="statistics.quizStatistics" class="chart">
      <apexchart
        width="500"
        type="pie"
        :options="statistics.quizStatistics.chartOptions"
        :series="statistics.quizStatistics.data"
      ></apexchart>
    </span>
    <h3 v-else>No data about quiz statistics has been found about this user</h3>

    <span v-if="statistics.answerStatistics" class="chart">
      <apexchart
        width="500"
        type="pie"
        :options="statistics.answerStatistics.chartOptions"
        :series="statistics.answerStatistics.data"
      ></apexchart>
    </span>
    <h3 v-else>No data about answer statistics has been found about this user</h3>
  </div>
  <div v-else>
    <h1>Loading data...</h1>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  data() {
    return {
      isLoading: true,
    };
  },
  created() {
    this.statistics = this.$store.getters[
      "teacherStore/getBoardStatisticsByStudent"
    ];
    
    console.log(this.statistics)
    if (this.statistics)
    this.isLoading = false
  },
};
</script>

<style scoped>
#chartArea {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

.chart {
  border: 1px solid #000;
  padding: 30px;
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