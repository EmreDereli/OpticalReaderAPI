const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const crypto = require("md5");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "deneme"
});

//get exams by id
router.get("/:examNo", (req, res, next) => {
  const examNo = req.params.examNo;
  const queryString =
    "SELECT students.name, students.surname, students.student_no, exams.correctAnswer, exams.wrongAnswer FROM exams INNER JOIN students ON exams.student_no = students.student_no WHERE exams.exam_no=?";
  connection.query(queryString, [examNo], (err, rows, fields) => {
    const students = rows.map(item => {
      return {
        name: item.name,
        surname: item.surname,
        studentNo: item.student_no,
        correctAnswer: item.correctAnswer,
        wrongAnswer: item.wrongAnswer
      };
    });
    res.json(students);
  });
});

router.get("/:examNo/:studentNo", (req, res, next) => {
  const examNo = req.params.examNo;
  const studentNo = req.params.studentNo;
  const queryString =
    "SELECT students.name, students.surname, students.student_no, exams.correctAnswer, exams.wrongAnswer FROM exams INNER JOIN students ON exams.student_no = students.student_no WHERE exams.exam_no=? and students.student_no =?";
  connection.query(queryString, [examNo, studentNo], (err, rows, fields) => {
    const students = rows.map(item => {
      return {
        student: {
          name: item.name,
          surname: item.surname,
          no: item.student_no
        },
        exams: {
          correctAnswer: item.correctAnswer,
          wrongAnswer: item.wrongAnswer
        }
      };
    });
    res.json(students);
  });
});

//exam post
router.post("/", (req, res, next) => {
  const exam = {
    examNo: req.body.examNo,
    studentName: req.body.studentName,
    studentSurname: req.body.studentSurname,
    studentNo: req.body.studentNo,
    correctAnswer: req.body.correctAnswer,
    wrongAnswer: req.body.wrongAnswer
  };
  const queryStudent = "SELECT * FROM students WHERE student_no=?";
  connection.query(queryStudent, [exam.studentNo], (err, rows, fields) => {
    if (rows.length > 0) {
      examAdd(exam, res);
    } else {
      studentAdd(exam, res);
    }
  });
});

studentAdd = (exam, res) => {
  const queryString =
    "INSERT INTO students(student_no,name,surname) VALUES(?,?,?)";
  connection.query(
    queryString,
    [exam.studentNo, exam.studentName, exam.studentSurname],
    (err, rows, fields) => {
      if (err) {
        res.json({ message: "ERROR" });
      } else {
        examAdd(exam, res);
      }
    }
  );
};

examAdd = (exam, res) => {
  const queryString =
    "INSERT INTO exams(exam_no,student_no,correctAnswer, wrongAnswer) VALUES(?,?,?,?)";

  connection.query(
    queryString,
    [exam.examNo, exam.studentNo, exam.correctAnswer, exam.wrongAnswer],
    (err, rows, fields) => {
      if (err) {
        res.json({ message: "ERROR" });
      } else {
        res.json({ message: "Exam added Successfully" });
      }
    }
  );
};

module.exports = router;
