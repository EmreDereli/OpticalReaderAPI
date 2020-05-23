const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const crypto = require("md5");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "deneme",
});

router.get("/", (req, res, next) => {
  const answer = {
    exam_no: req.body.examNo,
    answer_list: req.body.answerList,
  };
  const queryString = "SELECT * FROM answer";
  connection.query(queryString, null, (err, rows, fields) => {
    const answers = rows.map((item) => {
      return {
        examNo: item.exam_no,
        answerList: item.answer_list,
      };
    });
    res.json(answers);
  });
});

router.get("/:examNo", (req, res, next) => {
  const id = req.params.examNo;
  const queryString = "SELECT * FROM answer WHERE exam_no=?";
  connection.query(queryString, [id], (err, rows, fields) => {
    const answers = {
      examNo: rows[0].exam_no,
      answerList: rows[0].answer_list,
    };
    res.status(200).json(answers);
  });
});

router.post("/", (req, res, next) => {
  const answer = {
    exam_no: req.body.examNo,
    answer_list: req.body.answerList,
  };
  const queryString = "INSERT INTO answer(exam_no,answer_list) VALUES(?,?)";
  connection.query(
    queryString,
    [answer.exam_no, answer.answer_list],
    (err, rows, fields) => {
      if (err) {
        res.json({ message: "ERROR" });
      } else {
        res.json({ message: "Successfully" });
      }
    }
  );
});

module.exports = router;
