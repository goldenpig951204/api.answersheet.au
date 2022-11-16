const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const middlewares = require('./middlewares');
const apiRoutes = require('./routes/api');
const { dbConnect } = require('./services/db');
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

dbConnect('mongodb://localhost:27017');

app.use('/api/v1', apiRoutes);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
