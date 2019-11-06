
const serverless = require('serverless');
const express = require('express');
const app = express();
const petsApiRouter = require('./api/petsApiRouter');
app.use('/', petsApiRouter);

module.exports.handle = serverless(app, {});