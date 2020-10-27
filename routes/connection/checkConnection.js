async function checkConnection(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.contentType('application/json');
  res.status(200).send(JSON.stringify({ connected: true }));
}

module.exports = checkConnection;
