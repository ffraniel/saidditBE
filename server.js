if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev';

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const apiRouter = require('./router/apiRouter');

const mongoose = require('mongoose');
const config = require('./config');

const db = config.DB[process.env.NODE_ENV] || process.env.DB;

mongoose.Promise = Promise;

mongoose.connect(db, { useMongoClient: true })
// eslint-disable-next-line no-console
  .then(() => console.log('successfully connected to', db))
  // eslint-disable-next-line no-console
  .catch(err => console.log('connection failed', err));

app.use(cors());

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', (req, res)=>{
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/favicon.ico', (req, res) => {
  res.status(204);
});

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
  if (err.status === 404) {
    return res.status(404).send({
      message: err.message
    });
  }
  if (err.status === 400) {
    return res.status(400).send({
      message: err.message
    });
  }
  if (err.name === "CastError") {
    return res.status(400).send({
      message:err.message,
      error:err
    });
  }
  next(err);
});

app.use((err, req, res) => {
  res.status(500).send({
    error: err
  });
});

module.exports = app;