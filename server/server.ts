// StAuth10065: I, Man Vu, 000801665 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.

const express = require("express");
const app = express();
const { server_port } = require("./config/index");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const sequelize = require("./config/orm");
sequelize.authenticate().catch(err => console.error("Sequelize connection error:", err));

const scheduler = require("./services/scheduler/checkAttempts");
const connectHistory = require("connect-history-api-fallback");

/* 
  Import all routes in the application
*/
const authRoutes = require("./api/routes/auth.ts");
const homeRoutes = require("./api/routes/home.ts");
const userRoutes = require("./api/routes/users.ts");
const quizRoutes = require("./api/routes/quizzes.ts");
const teacherRoutes = require("./api/routes/teacher.ts");
const statisticsRoutes = require("./api/routes/statistics.ts");
const questionsRoutes = require("./api/routes/questions.ts");
const vocabularyRoutes = require("./api/routes/vocabulary.ts");
const mockTestRoutes = require("./api/routes/mockTests.ts");
const writingRoutes = require("./api/routes/writing.ts");

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
app.use("/api/vocabulary", vocabularyRoutes);
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
