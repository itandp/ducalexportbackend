async function informacionPalet(req, res, request) {
  const { codigo } = req.query;
  let response = {};
  const Error = {
    error: false, mensaje: '',
  };
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.contentType('application/json');
  try {
    const fields = codigo.split(';').reduce((prev, current) => {
      const newObject = { ...prev };
      const values = current.split(':');
      // eslint-disable-next-line prefer-destructuring
      newObject[values[0]] = values[1];
      return newObject;
    }, {});

    const { NumEntrada, Palet } = fields;

    const stringRequest = `SELECT * FROM CABECERAENTTRA 
    INNER JOIN PROVEE ON CABECERAENTTRA.CliCabec = PROVEE.CodProvee 
    INNER JOIN ARTIC ON CABECERAENTTRA.codArtCabec = ARTIC.CodArtic 
    LEFT JOIN REGISTRO_RECEPCION_ENTRADA ON 
    CABECERAENTTRA.NumDocCabec = REGISTRO_RECEPCION_ENTRADA.NumEntrada AND REGISTRO_RECEPCION_ENTRADA.NumPalet = ${Palet} 
    WHERE NumDocCabec='${NumEntrada}' ORDER BY ID DESC`;

    request.query(stringRequest, (err, result) => {
      if (err) {
        Error.mensaje = err.originalError.info.message;
        Error.error = true;
      } else if (result && result.recordset && result.recordset.length === 0) {
        Error.mensaje = `No se ha encontrado el número de entrada ${NumEntrada} en la base de datos.`;
        Error.error = true;
      } else {
        // eslint-disable-next-line prefer-destructuring
        response = result.recordset[0];
      }
      res.status(200).send(JSON.stringify({ ...response, Error, Palet }));
    });
  } catch (e) {
    Error.mensaje = e;
    Error.error = true;
    res.status(200).send(JSON.stringify({ ...response, Error }));
  }
}

module.exports = informacionPalet;
