const { Server } = require('http');
const { MongoClient } = require('mongodb');
const auth0 = require('auth0');
require('dotenv').config();   // loading env vars from the ".env" file

const AuthManager = require('./managers/auth-manager');
const MachineManager = require('./machine-manager');
const makeApp = require('./make-app');


// auth client & manager
const domain = process.env.AUTH0_DOMAIN;
const clientId = process.env.AUTH0_CLIENT_ID;
const auth0Client = new auth0.AuthenticationClient({ domain, clientId });
const authManager = new AuthManager(auth0Client);

// db params
const dbName = process.env.DB_NAME;
const dbHost = process.env.DB_HOST;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const dbUri = `mongodb+srv://${dbUsername}:${dbPassword}@${dbHost}`;

// connecting to remote MongoDb and starting HTTP server
MongoClient.connect(dbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(client => {
    const db = client.db(dbName);
    const col = db.collection('machines');

    // TODO: remove
    col.find().toArray()
      .then(data => {
        console.log(data);
      });

    const machineManager = new MachineManager(col);  // machine manager
    const app = makeApp({ authManager, machineManager });   // app
    const server = new Server(app);   // server
    const port = process.env.PORT;
    // starting server...
    server.listen(port, () => {
      console.log('HarveyNet ownership server listening on port '
        + server.address().port + '...');
    });
  })
  .catch(err => {
    console.error(err);
    process.exit(-1);
  });
