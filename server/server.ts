import express from "express";
import { server_port } from "./config/index";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";

const app = express();

import "./services/scheduler/checkAttempts";
import connectHistory from "connect-history-api-fallback";

/* 
  Import all routes in the application
*/
import authRoutes from "./api/routes/auth";
import homeRoutes from "./api/routes/home";
import userRoutes from "./api/routes/users";
import quizRoutes from "./api/routes/quizzes";
import teacherRoutes from "./api/routes/teacher";
import statisticsRoutes from "./api/routes/statistics";
import questionsRoutes from "./api/routes/questions";
import lexiconRoutes from "./api/routes/lexicon";
import mockTestRoutes from "./api/routes/mockTests";
import writingRoutes from "./api/routes/writing";
import courseRoutes from "./api/routes/courses";

/**
 * Set CORS policy in development environment to prevent CORS blocking
 */
if (process.env.NODE_ENV === "development") {
  app.use(cors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
  }));
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === "production") {
  // Allowing refreshing current page without errors in production
  app.use(connectHistory());
  app.use(express.static(path.join(__dirname, "../dist")));

  // Redirecting to https protocol when user is landing on http protocol
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https')
      res.redirect(`https://${req.header('host')}${req.url}`)
    else
      next()
  })
}

// Use these routes
app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/questions", questionsRoutes);
app.use("/api/lexicon", lexiconRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/mock-tests", mockTestRoutes);
app.use("/api/writing", writingRoutes);

if (process.env.NODE_ENV === "production") {
  // In production, port number is automatically assigned by the hosting provider 
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT}.`);
  });
} else {
  app.listen(server_port, () => {
    console.log(`Server is running on port ${server_port}.`);
  });
}
