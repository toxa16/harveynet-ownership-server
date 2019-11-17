const express = require('express');
const cors = require('cors');

const ownershipFixture = require('../test/fixtures/ownership');

const app = express();
app.use(cors());

/**
 * Index endpoint.
 */
app.get('/', (req, res) => {
  res.end('HarveyNet ownership server v0.0.1');
});

/**
 * User machines endpoint.
 */
app.get('/me/machines', (req, res) => {
  const { username } = req.query;
  let machines = [];

  if (username) {
    const ownership = ownershipFixture
      .find(x => x.username === username);
    if (ownership) {
      machines = ownership.machines;
    }
  }
  
  res.json({ data: machines });
});

module.exports = app;
