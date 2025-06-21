import { expect } from "chai";
import statisticsController from "../../controllers/statistics.ts";

// these tests expect that a sample database is available

describe("StatisticsController: getStatistics", () => {
  it("Should load statistics", async () => {
    const actual = await statisticsController.getStatistics(1);
    expect(actual.statusCode).to.equal(200);
    expect(actual.error).to.equal(null);
    expect(actual.response).to.be.an("object");
  });
});

describe("StatisticsController: getBoardStatisticsByQuiz", () => {
  it("Should load board statistics for quiz", async () => {
    const data = { quizId: 1, dateFrom: "2021-01-01", dateTo: "2023-01-01" };
    const actual = await statisticsController.getBoardStatisticsByQuiz(data);
    expect(actual.statusCode).to.equal(200);
    expect(actual.error).to.equal(null);
    expect(actual.response).to.be.an("object");
  });
});

describe("StatisticsController: getBoardStatisticsByStudent", () => {
  it("Should load board statistics for student", async () => {
    const data = { userId: 1, dateFrom: "2021-01-01", dateTo: "2023-01-01" };
    const actual = await statisticsController.getBoardStatisticsByStudent(data);
    expect(actual.statusCode).to.equal(200);
    expect(actual.error).to.equal(null);
    expect(actual.response).to.be.an("object");
  });
});
