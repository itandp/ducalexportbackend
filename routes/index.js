const login = require('./login/login');
const checkConnection = require('./connection/checkConnection');
const recepcion = require('./registro/recepcion');
const entrada = require('./registro/entrada');
const informacionPalet = require('./registro/informacionPalet');

module.exports = {
  login,
  checkConnection,
  recepcion,
  entrada,
  informacionPalet,
};
