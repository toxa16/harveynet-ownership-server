const express = require('express');
const cors = require('cors');


const machines0 = [
  {
    machineId: 'machine1',
  },
  {
    machineId: 'machine2',
  },
  {
    machineId: 'machine3',
  },
];


function makeApp({ authClient, machineManager }) {
  const app = express();
  app.use(cors());

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
      const machines = await machineManager.getUserMachines();
      res.json(machines);
    } catch(err) {
      next(err);
    }
  });


  return app;
}


module.exports = makeApp;
