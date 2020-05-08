const express = require('express');
const cors = require('cors');

const Unauthorized = require('./errors/unauthorized');


function makeApp({ authManager, machineManager }) {
  const app = express();
  app.use(cors());

  // logging (dev only)
  app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(req.method, req.url);
    }
    next();
  });


  // GET /
  app.get('/', (req, res) => {
    res.end('HarveyNet ownership server v0.1.0');
  });


  // GET /me/machines
  app.get('/me/machines', async (req, res, next) => {
    try {
      const header = req.headers.authorization;
      const userInfo = await authManager.authenticateUserByHeader(header);
      req.userInfo = userInfo;
      next();
    } catch(err) {
      next(err);
    }
  });
  app.get('/me/machines', async (req, res, next) => {
    try {
      //console.log(req.userInfo)
      const { sub } = req.userInfo;
      const machines = await machineManager.getUserMachines(sub);
      res.json(machines);
    } catch(err) {
      next(err);
    }
  });


  // custom error handler
  app.use((err, req, res, next) => {
    if (err instanceof Unauthorized) {
      res.status(401);
    }
    next(err);  // to default error handler
  });


  return app;
}


module.exports = makeApp;
