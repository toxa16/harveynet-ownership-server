const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const BadRequest = require('./errors/bad-request');
const Unauthorized = require('./errors/unauthorized');
const adminRouter = require('./routers/admin');


function makeApp({ authManager, machineManager }) {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  // logging (dev only)
  app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(req.method, req.url);
    }
    next();
  });

  // setting dependencies as `req` properties
  app.use((req, res, next) => {
    req.authManager = authManager;
    req.machineManager = machineManager;
    next();
  });

  // admin router "/admin/*"
  app.use('/admin', adminRouter);


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
    if (err instanceof BadRequest) {
      res.status(400);
    } else if (err instanceof Unauthorized) {
      res.status(401);
    }
    next(err);  // to default error handler
  });


  return app;
}


module.exports = makeApp;
