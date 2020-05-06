const express = require('express');
const cors = require('cors');


function makeApp(authClient) {
  const app = express();
  app.use(cors());

  app.get('/', (req, res) => {
    res.end('HarveyNet ownership server v0.1.0');
  });

  app.get('/me/machines', (req, res) => {
    res.json([]);
  });

  return app;
}


module.exports = makeApp;
