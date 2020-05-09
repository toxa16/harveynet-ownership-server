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
router.get('/machines', async (req, res, next) => {
  try {
    const machines = await req.machineManager.getAllMachines();
    res.json(machines);
  } catch(err) {
    next(err);
  }
});

// POST /machines
router.post('/machines', async (req, res, next) => {
  try {
    const { userId, machineId } = req.body;
    const insertedId = await req.machineManager
      .addMachine({ userId, machineId });
    res.status(201).json({ insertedId });
  } catch(err) {
    next(err);
  }
});

module.exports = router;
