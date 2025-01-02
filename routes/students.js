const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const _ = require('lodash');
const auth = require("../middleware/auth");
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
    res.header('x-auth-token', token).send({
        message: 'Successfully registered student',
        student: _.pick(student, ['id', 'name', 'email']),
    });
});

router.get('/me', [auth], async (req, res) => {
    const student = await Student.findById(req.user._id).select('-password');
    if(!student) return res.status(404).send('Student with given ID is not found');
    res.send(_.pick(student, ['id', 'name', 'email']));
});

module.exports = router;
