const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const studentRouters = require("./api/routes/students");
const examsRouters = require("./api/routes/exams");
const imagesRouters = require("./api/routes/images");
const answersRouters = require("./api/routes/answers");

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));

app.use("/students", studentRouters);
app.use("/exams", examsRouters);
app.use("/images", imagesRouters);
app.use("/answers", answersRouters);
app.use("/", (req, res, next) => {
  res.send("Hello");
});

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
