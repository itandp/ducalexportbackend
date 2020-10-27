const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const {
  login,
  checkConnection,
  recepcion,
  entrada,
  informacionPalet,
} = require('./routes/index');
const { CONFIG } = require('./config');

const connectionPool = sql.connect(CONFIG, (err) => {
  if (err) { throw err; }
});
const request = new sql.Request(connectionPool);

const app = express();

app.listen(5001, () => {
  app.use(bodyParser.json({
    limit: '50mb',
    extended: true,
    parameterLimit: 50000,
  }));

  app.get('/connected', (req, res) => {
    checkConnection(res);
  });

  app.get('/informacionpalet', (req, res) => {
    informacionPalet(req, res, request);
  });

  app.post('/recepcion', (req, res) => {
    recepcion(req, res, request);
  });

  app.post('/entrada', (req, res) => {
    entrada(req, res, request);
  });

  app.post('/login', (req, res) => {
    login(req, res, request);
  });
});
