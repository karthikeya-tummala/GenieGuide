const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const { Student, validate } = require('../models/student');

router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let student = await Student.findOne({ email: req.body.email });
    if (student) return res.status(400).send('Student with given email already exists.');

    const hashedPassword = argon2.hash(req.body.password, {type: argon2.argon2id});

    student = new Student({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    await student.save();

    const token = student.generateAuthToken();
    res.header('x-auth-token', token).send('Successfully Registered');
});

router.get('/me', async (req, res) => {
    const students = await Student.find();
    res.send(students);
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
