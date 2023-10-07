// StAuth10065: I, Man Vu, 000801665 certify that this material is my original work. No other person's work has been used without due acknowledgement. I have not made my work available to anyone else.

const express = require("express");
const app = express();
const { server_port } = require("./config/index");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const scheduler = require("./services/scheduler/checkAttempts");
const history = require("connect-history-api-fallback");

/* 
  Import all routes in the application
*/
const authRoutes = require("./api/routes/auth");
const discussionRoutes = require("./api/routes/discussion");
const homeRoutes = require("./api/routes/home");
const userRoutes = require("./api/routes/users");
const quizRoutes = require("./api/routes/quizzes");
const threadsRoutes = require("./api/routes/threads");
const teacherRoutes = require("./api/routes/teacher");
const statisticsRoutes = require("./api/routes/statistics");
const postsRoutes = require("./api/routes/posts");
const questionsRoutes = require("./api/routes/questions");

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
  app.use(history());
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
app.use("/api/discussion", discussionRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/threads", threadsRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/questions", questionsRoutes);

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
