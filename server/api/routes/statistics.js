const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const authTeacherMiddleware = require("../middlewares/authTeacher");
const statisticsController = require("../controllers/statistics");

/**
 * Route that gets student statistics
 */
router.get("/", authMiddleware, async (req, res) => {
    const userId = req.user.id;

    const statistics = await statisticsController.getStatistics(userId)

    res.status(200).json(statistics)
});

/**
 * Route that gets board statistics by quiz
 */
router.post("/board/quiz/:id", authTeacherMiddleware, async (req, res) => {
    const dateFrom = req.body.dateFrom
    const dateTo = req.body.dateTo
    const quizId = req.params.id

    const data = {dateFrom, dateTo, quizId}
    const statistics = await statisticsController.getBoardStatisticsByQuiz(data)

    res.status(200).json(statistics)
});

/**
 * Route that gets board statistics by student id
 */
router.post("/board/student/:id", authTeacherMiddleware, async (req, res) => {
    const dateFrom = req.body.dateFrom
    const dateTo = req.body.dateTo
    const userId = req.params.id

    const data = {dateFrom, dateTo, userId}
    const statistics = await statisticsController.getBoardStatisticsByStudent(data)

    res.status(200).json(statistics)
});

module.exports = router;
