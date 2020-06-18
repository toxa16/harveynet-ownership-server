const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const Pusher = require('pusher');

const BadRequest = require('./errors/bad-request');
const Unauthorized = require('./errors/unauthorized');
const adminRouter = require('./routers/admin');


const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true
});


function makeApp({ authManager, machineManager }) {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

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
    res.end('HarveyNet ownership server v0.1.1');
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

  app.post('/control-auth-check', (req, res) => {
    const user_id = 'TEST_USER';  // HARDCODE, todo: extract `user_id` from access token
    const { channel_name } = req.body;
    pusher.get(
      { path: `/channels/${channel_name}/users`, params: {} },
      function(error, request, response) {
        if (error) {
          console.log(error);
          const message = 'Pusher internal error.';
          return res.status(500).json({ message });
        }
        if (response.statusCode === 200) {
          var result = JSON.parse(response.body);
          var users = result.users;
          const me = users.find(x => x.id === user_id);
          if (me) {
            const message = 'Only one simultaneous control connection allowed.';
            res.status(403).json({ message });
          } else {
            res.end();
          }
        }
      }
    );
  });

  app.post('/pusher/auth', (req, res) => {
    const user_id = 'TEST_USER';  // HARDCODE, todo: extract `user_id` from access token
    const { socket_id, channel_name } = req.body;
    var presenceData = { user_id };
    var auth = pusher.authenticate(socket_id, channel_name, presenceData);
    res.send(auth);
  });
  
  app.post('/pusher/auth/machine', (req, res) => {
    console.log(req.method, req.url);
    const { machineId } = req.body;
    var socketId = req.body.socket_id;
    var channel = req.body.channel_name;
    var presenceData = {
      user_id: machineId,
    };
    var auth = pusher.authenticate(socketId, channel, presenceData);
    res.send(auth);
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
