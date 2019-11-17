const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const ownershipFixture = [
  {
    username: 'alice',
    machines: [
      { id: 'machine1' },
      { id: 'machine2' },
    ]
  },
  {
    username: 'bob',
    machines: [
      { id: 'machine3' },
    ],
  },
];

app.get('/', (req, res) => {
  res.end('HarveyNet ownership server.');
});

app.get('/me/machines', (req, res) => {
  const { username } = req.query;
  const ownership = ownershipFixture.find(x => x.username === username);
  const { machines } = ownership;
  res.json(machines);
});

module.exports = app;
