/* eslint-disable indent */
'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const articlesRouter = require('./articles/articles-router');
const usersRouter = require('./users/users-router');
const commentsRouter = require('./comments/comments-router');
const errorHandler = require('./errorHandler');

const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.get('/', (req,res) => {
    res.status(200).send('Hello, world!');
  });

app.use('/api', articlesRouter);
app.use('/api', usersRouter);
app.use('/api', commentsRouter);
app.use(errorHandler);
    
module.exports = app;