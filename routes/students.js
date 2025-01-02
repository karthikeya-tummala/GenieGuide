const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const _ = require('lodash');
const { Student, validate } = require('../models/student');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let student = await Student.findOne({ email: req.body.email });
    if (student) return res.status(400).send('Student with given email already exists.');

    const hashedPassword = await argon2.hash(req.body.password, {type: argon2.argon2id});

    student = new Student(_.pick(req.body, ['name', 'email']));
    student.password = hashedPassword;
    await student.save();

    const token = student.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(student, ['id', 'name', 'email']));
});

router.get('/me', async (req, res) => {
    const students = await Student.find();
    res.send(_.pick(students, ['id', 'name', 'email']));
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
