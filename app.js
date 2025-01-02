require('express-async-errors');
const express = require('express');
const mongoose = require('mongoose');
const index = require('./routes/index');
const students = require('./routes/students');
const app = express();

//Body parser
app.use(express.json());

//Routes
app.use('/', index);
app.use('/students', students);

//DB connection
mongoose.connect('mongodb://localhost/GenieGuide', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`Connection established with ${mongoose.connection.name}`))
    .catch((ex) => console.log(ex));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on Port ${port}`));