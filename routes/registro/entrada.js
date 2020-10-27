async function entrada(req, res, request) {
  const {
    NumDocCabec: NumEntrada, Palet, Usuario, Camara, Calle,
  } = req.body;
  const data = {
    error: true, mensaje: '',
  };
  console.log(req.body);
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
    if (result.recordset.length > 0 && result.recordset[0].Estado === 'Tunel') {
      data.error = false;
      insertRequest = `INSERT INTO REGISTRO_RECEPCION_ENTRADA (NumEntrada ,NumPalet ,FechaHora ,Estado ,Usuario) 
      VALUES (${NumEntrada}, ${Palet}, getDate(), 'Almacen', '${Usuario}'); 
      INSERT INTO REGISTRO_ALMACENAMIENTO (NumEntrada, NumPalet, Fecha, Camara, Calle) VALUES (${NumEntrada}, ${Palet}, getDate(), ${Camara}, ${Calle});`;
    } else {
      data.mensaje = 'No se ha encontrado ningún palet con este código en \'Tunel\'';
      res.status(200).send(JSON.stringify(data));
      return;
    }
    console.log(insertRequest);
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

module.exports = entrada;
