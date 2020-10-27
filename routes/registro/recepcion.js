async function recepcion(req, res, request) {
  const {
    NumDocCabec: NumEntrada, Palet, Estado, Usuario,
  } = req.body;
  const data = {
    error: true, mensaje: '',
  };

  const stringRequest = `SELECT * FROM REGISTRO_RECEPCION_ENTRADA WHERE NumEntrada='${NumEntrada}' AND NumPalet='${Palet}' ORDER BY ID DESC`;

  request.query(stringRequest, (err, result) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.contentType('application/json');

    if (err) {
      data.mensaje = err.originalError.info.message;
      res.status(200).send(JSON.stringify(data));
      return;
    }
    let insertRequest = '';
    if (result.recordset.length === 0) {
      data.error = false;
      insertRequest = `INSERT INTO REGISTRO_RECEPCION_ENTRADA (NumEntrada ,NumPalet ,FechaHora ,Estado ,Usuario) VALUES (${NumEntrada}, ${Palet}, getDate(), '${Estado}', '${Usuario}')`;
    } else if (result.recordset[0].Estado === Estado) {
      data.mensaje = `Este palet ya estaba en '${Estado}'`;
      res.status(200).send(JSON.stringify(data));
      return;
    } else if (result.recordset[0].Estado === 'Mantenimiento' && Estado === 'Tunel') {
      insertRequest = `INSERT INTO REGISTRO_RECEPCION_ENTRADA (NumEntrada ,NumPalet ,FechaHora ,Estado ,Usuario) VALUES (${NumEntrada}, ${Palet}, getDate(), '${Estado}', '${Usuario}')`;
    } else if (result.recordset[0].Estado === 'Tunel' && Estado === 'Mantenimiento') {
      data.mensaje = 'Este palet ya estaba en \'Tunel\' y por lo tanto no puede pasar a \'Mantenimiento\'';
      res.status(200).send(JSON.stringify(data));
      return;
    }
    request.query(insertRequest, (insertRequestErr) => {
      if (insertRequestErr) {
        data.mensaje = insertRequestErr.originalError.info.message;
      } else {
        data.error = false;
      }
      res.status(200).send(JSON.stringify(data));
    });
  });
}

module.exports = recepcion;
