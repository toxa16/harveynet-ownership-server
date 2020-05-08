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


  app.get('/', (req, res) => {
    res.end('HarveyNet ownership server v0.1.0');
  });


  /*app.get('/me/machines', async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(401);
      return next(new Error('Unauthorized: No Authorization header.'));
    }
    const authHeaderParts = authorization.split('Bearer ');
    const token = authHeaderParts[1];
    if (!token) {
      res.status(401);
      return next(new Error('Unauthorized: Only Bearer token type is supported.'));
    }
    try {
      const userInfo = await authClient.users.getInfo(token);
      next();
    } catch(err) {
      if (err.message.match(/401/)) {
        res.status(401);
      }
      next(err);
    }
  });*/
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
      const machines = await machineManager.getUserMachines();
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
