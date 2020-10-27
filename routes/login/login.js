async function login(req, res, request) {
  const data = {
    error: true, mensaje: 'Las credenciales no son correctas',
  };
  const { usuario, contraseña } = req.body;

  const stringRequest = `SELECT COUNT(*) AS count FROM USU WHERE Usu='${usuario}' AND Pwd='${contraseña}'`;

  request.query(stringRequest, (err, result) => {
    if (err) {
      data.mensaje = err;
    }

    if (result.recordset[0].count === 1) {
      data.mensaje = '';
      data.error = false;
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.contentType('application/json');
    res.status(200).send(JSON.stringify(data));
  });
}

module.exports = login;
