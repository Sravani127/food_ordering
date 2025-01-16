const express = require('express');
const bodyParser = require('body-parser');
const app = express();
// const courses = require('./src/routes/courseRoutes');
const routes = require('./src/routes/authRoutes');
const cors = require('cors');

// pre build middlewares
app.use(cors());
app.use(bodyParser.json());

app.use('',routes);

module.exports = app;