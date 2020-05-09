const express = require('express');


const router = express.Router();

// authentication
router.use((req, res, next) => {
  try {
    req.authManager.authenticateAdmin(req.headers.authorization);
    next();
  } catch(err) {
    next(err);
  }
});

// GET /
router.get('/', (req, res) => {
  res.end('HarveyNet ownership server - Admin interface');
});

// GET /machines
router.get('/machines', (req, res) => {
  res.end('GET /admin/machines endpoint');
});

module.exports = router;
