const express = require('express');


const router = express.Router();

router.get('/', (req, res) => {
  res.end('HarveyNet ownership server - Admin interface');
});

router.get('/machines', (req, res) => {
  res.end('GET /admin/machines endpoint');
});

module.exports = router;
