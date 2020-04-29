const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const Students = require("../models/students");
const jwt = require("jsonwebtoken");
const crypto = require("md5");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "deneme",
});

//get students by id
router.get("/:studentId", (req, res, next) => {
  const id = req.params.studentId;
  const queryString = "SELECT * FROM students WHERE student_no=?";
  connection.query(queryString, [id], (err, rows, fields) => {
    // const students = rows.map(item => {
    //   Students.name = item.name;
    //   Students.surname = item.surname;
    //   Students.student_no = item.student_no;
    //   return Students;
    // });
    const students = {
      name: rows[0].name,
      surname: rows[0].surname,
      studentNo: rows[0].student_no,
    };
    res.status(200).json(students);
  });
});

//student post
router.post("/", (req, res, next) => {
  const student = {
    name: req.body.name,
    surname: req.body.surname,
    student_no: req.body.studentNo,
  };
  const queryString =
    "INSERT INTO students(student_no,name,surname) VALUES(?,?,?)";
  connection.query(
    queryString,
    [student.student_no, student.name, student.surname],
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
