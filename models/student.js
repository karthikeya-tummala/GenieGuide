const mongoose = require('mongoose');
const Joi = require('joi');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 5,
        maxLength: 255
    },
    password: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 1024
    },
});

const Student = mongoose.model('Student', studentSchema);

function validateStudent(student){
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(30),
        email: Joi.string().required().min(5).max(255).email(),
        password: Joi.string().required().min(4).max(255),
    });

    return schema.validate(student);
}

exports.Student = Student;
exports.validate = validateStudent;