const express = require('express');
const router = express.Router();
const { Student, validate } = require('../models/student');

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let student = await Student.findOne({ email: req.body.email });
  if (student) return res.status(400).send('Student with given email already exists.');

  student = new Student({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });

  try {
    await student.save();
    res.send({ message: 'Student registered successfully', student });
  } catch (err) {
    res.status(500).send('Something went wrong while saving the student.');
  }
});

router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.send(students);
  } catch (err) {
    res.status(500).send('Something went wrong while fetching students.');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).send('Student not found.');
    res.send(student);
  } catch (err) {
    res.status(500).send('Something went wrong while fetching the student.');
  }
});

module.exports = router;
