<template>
  <div id="chart-area" v-if="currentStatistics.summary !== false">
    <span class="chart">
      <table id="bar-chart">
        <tr>
          <th>Student Name</th>
          <th>Date Completed</th>
          <th>Grade</th>
        </tr>
        <tr v-for="a in attempts" :key="a.end_time">
          <td>{{ a.full_name }}</td>
          <td>{{ formattedTime(a.end_time) }}</td>
          <td>{{ a.grade }}%</td>
        </tr>
      </table>
      <div v-if="pagination.totalPages !== null" class="block-27 text-center">
        <ul>
          <li><span class="page-number" @click="prevPage()">&lt;</span></li>
          <li
            :class="{ active: page === pagination.currentPage }"
            v-for="page in pagination.totalPages"
            :key="page"
          >
            <span class="page-number" @click="specificPage(page)">{{
              page
            }}</span>
          </li>
          <li><span class="page-number" @click="nextPage()">&gt;</span></li>
        </ul>
        <p class="font-italic pagination-caption">
          Showing
          <span class="badge badge-pill badge-secondary">{{
            attempts.length
          }}</span>
          out of
          <span class="badge badge-pill badge-secondary">{{
            originalAttempts.length
          }}</span>
          attempts in total
        </p>
      </div>
    </span>
    <span class="chart">
      <p><span class="label-text">Highest score: </span> {{ maxScoreInfo }}</p>
      <p><span class="label-text">Lowest score: </span> {{ minScoreInfo }}</p>
      <p><span class="label-text">Mean score: </span> {{ avgScoreInfo }}</p>
      <apexchart
        width="500"
        type="bar"
        :options="barChart.chartOptions"
        :series="barChart.series"
      ></apexchart>
    </span>
  </div>
  <div v-else>
    <h1>This quiz has never been taken.</h1>
  </div>
</template>

<script>
import VueApexCharts from "vue3-apexcharts";
import moment from "moment";
import { paginator } from "../../common/helper";

export default {
  components: {
    apexchart: VueApexCharts,
  },
  computed: {
    maxScoreInfo() {
      const date = moment(this.max.end_time).format("YYYY-MMM-DD");
      return `${this.max.grade.toFixed(2)}% by ${
        this.max.full_name
      } on ${date}`;
    },
    minScoreInfo() {
      const date = moment(this.min.end_time).format("YYYY-MMM-DD");
      return `${this.min.grade.toFixed(2)}% by ${
        this.min.full_name
      } on ${date}`;
    },
    avgScoreInfo() {
      return `${this.avg.toFixed(2)}%`;
    },
    currentStatistics() {
      return this.$store.getters["teacherStore/getBoardStatisticsByQuiz"];
    },
  },
  watch: {
    currentStatistics() {
      this.statistics = this.currentStatistics;
      this.process();
    },
  },
  created() {
    this.statistics = this.$store.getters[
      "teacherStore/getBoardStatisticsByQuiz"
    ];
    this.process();
  },
  data() {
    return {
      barChart: {
        chartOptions: {
          responsive: [
            {
              breakpoint: 380,
              options: {
                chart: {
                  width: 315,
                  height: 360
                },
              },
            },
            {
              breakpoint: 769,
              options: {
                chart: {
                  width: 700,
                  height: 360
                },
              },
            },

          ],
          chart: {
            width: 200,
            id: "quiz-statistics-summary",
            foreColor: "#eee",
          },
          xaxis: {
            categories: [],
          },
          yaxis: [
            {
              labels: {
                formatter: function (value) {
                  return value.toFixed(0);
                },
              },
            },
          ],
          title: {
            text: "",
            align: "center",
            margin: 10,
            offsetX: 0,
            offsetY: 0,
            floating: false,
            style: {
              fontSize: "18px",
              fontWeight: "bold",
              fontFamily: undefined,
              color: "#eee",
            },
          },
        },
        series: [],
      },
      pagination: {
        currentPage: 1,
        totalPages: null,
        pagesPerPage: 10,
        nextPage: null,
        prevPage: null,
      },
      attempts: [],
      originalAttempts: [],
    };
  },
  methods: {
    process() {
      if (this.statistics.summary === false) {
        return
      }

      this.barChart.chartOptions.xaxis.categories = Object.keys(
        this.statistics.summary.categories
      );
      this.barChart.series = this.statistics.summary.categories;
      this.barChart.chartOptions.title.text = `Score distribution for Quiz ${this.statistics.summary.quizId}`;

      this.attempts = this.statistics.attempts;
      this.originalAttempts = this.attempts;
      this.max = this.statistics.summary.max;
      this.min = this.statistics.summary.min;
      this.avg = this.statistics.summary.avg;

      this.paginate();
    },
    formattedTime(endTime) {
      const date = moment(endTime).format("YYYY-MMM-DD");
      return date;
    },
    paginate(currentPage, pagesPerPage) {
      const paginated = paginator(
        this.attempts,
        currentPage || this.pagination.currentPage,
        pagesPerPage || this.pagination.pagesPerPage
      );

      this.attempts = paginated.data;
      this.pagination.totalPages = paginated.total_pages;
      this.pagination.currentPage = paginated.page;
      this.pagination.prevPage = paginated.pre_page;
      this.pagination.nextPage = paginated.next_page;
    },
    prevPage() {
      if (this.pagination.prevPage !== null) {
        this.changePage(this.pagination.prevPage);
      }
    },
    nextPage() {
      if (this.pagination.nextPage !== null) {
        this.changePage(this.pagination.nextPage);
      }
    },
    specificPage(page) {
      if (page !== null) {
        this.changePage(page);
      }
    },
    changePage(changeTo) {
      const paginated = paginator(
        this.originalAttempts,
        changeTo,
        this.pagination.pagesPerPage
      );

      this.attempts = paginated.data;
      this.pagination.currentPage = paginated.page;
      this.pagination.prevPage = paginated.pre_page;
      this.pagination.nextPage = paginated.next_page;
    },
  },
};
</script>

<style scoped>
.pagination-caption {
  font-size: 18px;
}

.page-number {
  cursor: pointer;
}

.block-27 {
  color: #eee;
}

.block-27 ul {
  padding: 0;
  margin: 0;
}
.block-27 ul li {
  display: inline-block;
  margin-bottom: 4px;
  font-weight: 400;
}
.block-27 ul li a,
.block-27 ul li span {
  color: gray;
  text-align: center;
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  border-radius: 50%;
  border: 1px solid #e6e6e6;
}
.block-27 ul li.active a,
.block-27 ul li.active span {
  background: #6356ca;
  color: #fff;
  border: 1px solid transparent;
}

.chart {
  border: 1px solid rgb(238, 207, 207);
  padding: 20px;
}

.label-text {
  font-weight: bold;
}

#chart-area {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
}

#bar-chart {
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

#bar-chart td,
#bar-chart th {
  padding: 15px;
}

#bar-chart tr {
  display: table-row;
  background: #23334b;
  color: #eee;
}
#bar-chart tr:nth-of-type(odd) {
  background: #0d0f13;
  color: #eee;
}
#bar-chart tr.header {
  color: #ffffff;
  background: #6356ca;
}
#bar-chart th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  color: #ffffff;
  background: #6356ca;
}

@media screen and (max-width: 768px) {
  #chart-area {
    display: flex;
    flex-direction: column;
  }
  .chart {
    margin-top: 2rem;
  }
}
</style>