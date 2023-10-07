const { sendSuccess, sendFailure } = require("../../config/res");
const STRINGS = require("../../config/strings");
const StatisticsModel = new (require("../../models/statistics"))();
const UserModel = new (require("../../models/user"))();
const moment = require("moment");

/**
 * Function maps statistics by a quiz from provided attempts information
 * @param {*} attempts attempts information
 */
function getBoardStatisticsSummaryByQuiz(attempts) {
  if (attempts.length === 0) {
    return false
  }

  return {
    min: attempts.reduce((p, c) => (p.grade < c.grade ? p : c)),
    max: attempts.reduce((p, c) => (p.grade > c.grade ? p : c)),
    avg: attempts.reduce((p, c) => p + c.grade, 0) / attempts.length,
    categories: [
      {
        name: "0% - 20%",
        data: [attempts.filter((a) => a.grade >= 0 && a.grade <= 20).length],
      },
      {
        name: "21% - 40%",
        data: [attempts.filter((a) => a.grade >= 21 && a.grade <= 40).length],
      },
      {
        name: "41% - 60%",
        data: [attempts.filter((a) => a.grade >= 41 && a.grade <= 60).length],
      },
      {
        name: "61% - 80%",
        data: [attempts.filter((a) => a.grade >= 61 && a.grade <= 80).length],
      },
      {
        name: "81% - 100%",
        data: [attempts.filter((a) => a.grade >= 81 && a.grade <= 100).length],
      },
    ],
  };
}

/**
 * 
 * @param {*} statsType 
 * @param {*} stats 
 * @param {*} additionalInfo 
 */
function createPieChart(statsType, stats, additionalInfo) {
  let data = [];
  let labels = [];
  let text = "";
  const dateFrom = additionalInfo ? additionalInfo.dateFrom : null;
  const dateTo = additionalInfo ? additionalInfo.dateTo : null;
  const firstName = additionalInfo ? additionalInfo.firstName : null;

  if (statsType === 1) {
    const { number_of_quizzes, incomplete, unattempted } = stats;

    if (number_of_quizzes === 0 && incomplete === 0 && unattempted === 0) {
      return false
    }

    const completed = number_of_quizzes - (incomplete + unattempted);

    labels = ["Completed", "Incomplete", "Not Attempted"];
    data = [completed, incomplete, unattempted];

    if (!dateFrom) {
      text = "How many quizzes have you completed?";
    } else {
      text = `Quizzes stats for ${firstName} between ${dateFrom} and ${dateTo}`;
    }
  } else {
    const { correct, partially_correct, incorrect, unanswered } = stats;

    if (correct === 0 && partially_correct === 0 && incorrect === 0 && unanswered === 0) {
      return false
    }

    labels = ["Correct", "Partially Correct", "Incorrect", "Unanswered"];
    data = [correct, partially_correct, incorrect, unanswered];

    if (!dateFrom) {
      text = "How well do you perform?";
    } else {
      text = `${firstName}'s performance between ${dateFrom} and ${dateTo}`;
    }
  }

  return {
    data,
    chartOptions: {
      chart: {
        width: 380,
        type: "pie",
        foreColor: '#eee'
      },
      title: {
        text,
        align: "center",
        margin: 10,
        offsetX: 0,
        offsetY: 0,
        floating: false,
        style: {
          fontSize: "16px",
          fontWeight: "bold",
          fontFamily: undefined,
          color: "#eee",
        },
      },
      labels,
      responsive: [
        {
          breakpoint: 350,
          options: {
            title: {
              align: 'left'
            },
            chart: {
              width: 350,
            },
            legend: {
              position: "bottom",
            },
            title: {
              style: {
                fontSize: "12px"
              }
            }
          },
        },
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 400,
            },
            legend: {
              position: "bottom",
            },
            title: {
              style: {
                fontSize: "12px"
              }
            }
          },
        },
      ],
    },
  };
}

module.exports = {
  getStatistics: async (userId) => {
    let quizStats = await StatisticsModel.findQuizOne(userId);
    let answerStats = await StatisticsModel.findAnswerOne(userId);

    if (!quizStats.error && !answerStats.error) {
      const quizStatsData = quizStats.response[0];
      const answerStatsData = answerStats.response[0];

      const quizStatistics = createPieChart(1, quizStatsData);
      const answerStatistics = createPieChart(2, answerStatsData);

      return sendSuccess({ quizStatistics, answerStatistics });
    } else {
      return sendFailure(STRINGS.CANNOT_LOAD_STATISTICS);
    }
  },
  getBoardStatisticsByQuiz: async (data) => {
    const { quizId, dateFrom, dateTo } = data;
    const attempts = await StatisticsModel.findBoardStatisticsByQuiz(data);
    const summary = getBoardStatisticsSummaryByQuiz(attempts.response);

    if (!attempts.error) {
      if (attempts.response.length === 0) {
        return sendSuccess({
          attempts: false,
          summary: false
        })
      }

      return sendSuccess({
        attempts: attempts.response,
        summary: { ...summary, quizId },
      });
    } else {
      return sendFailure(STRINGS.CANNOT_LOAD_STATISTICS);
    }
  },
  getBoardStatisticsByStudent: async (data) => {
    const { userId, dateFrom, dateTo } = data;
    const answer = await StatisticsModel.findBoardStatisticsByAnswerQuality( data );
    const quiz = await StatisticsModel.findBoardStatisticsByQuizCompleted(data);
    const user = await UserModel.findOneById(userId);

    if (!answer.error && !quiz.error && !user.error) {
      const quizStatsData = quiz.response[0];
      const answerStatsData = answer.response[0];
      const additionalInfo = {
        firstName: user.response[0].first_name,
        dateFrom: moment(dateFrom).format("YYYY-MMM-DD"),
        dateTo: moment(dateTo).format("YYYY-MMM-DD"),
      };

      const quizStatistics = createPieChart(1, quizStatsData, additionalInfo);
      const answerStatistics = createPieChart( 2, answerStatsData, additionalInfo );

      return sendSuccess({ quizStatistics, answerStatistics });
    } else {
      return sendFailure(STRINGS.CANNOT_LOAD_STATISTICS);
    }
  },
};
