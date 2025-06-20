import express from "express";
import authMiddleware from "../middlewares/auth";
import authTeacherMiddleware from "../middlewares/authTeacher";
import statisticsController from "../controllers/statistics";

const router = express.Router();

/**
 * Route that gets student statistics
 */
router.get("/", authMiddleware, async (req, res) => {
    const userId = Number(req.user.id);
    if (Number.isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user id" });
    }

    const statistics = await statisticsController.getStatistics(userId)

    res.status(200).json(statistics)
});

/**
 * Route that gets board statistics by quiz
 */
router.post("/board/quiz/:id", authTeacherMiddleware, async (req, res) => {
    const dateFrom = req.body.dateFrom
    const dateTo = req.body.dateTo
    const quizId = Number(req.params.id)
    if (Number.isNaN(quizId)) {
        return res.status(400).json({ error: "Invalid quiz id" });
    }

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
    const userId = Number(req.params.id)
    if (Number.isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user id" });
    }

    const data = {dateFrom, dateTo, userId}
    const statistics = await statisticsController.getBoardStatisticsByStudent(data)

    res.status(200).json(statistics)
});

export default router;
