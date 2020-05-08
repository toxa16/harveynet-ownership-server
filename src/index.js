const { Server } = require('http');
const auth0 = require('auth0');
require('dotenv').config();   // loading env vars from the ".env" file

const AuthManager = require('./managers/auth-manager');
const MachineManager = require('./machine-manager');
const makeApp = require('./make-app');


// auth client
const domain = process.env.AUTH0_DOMAIN;
const clientId = process.env.AUTH0_CLIENT_ID;
const auth0Client = new auth0.AuthenticationClient({ domain, clientId });

const authManager = new AuthManager(auth0Client);

// machine manager
const machineManager = new MachineManager();

// server
const server = new Server(makeApp({ authManager, machineManager }));
const port = process.env.PORT;
server.listen(port, () => {
  console.log('HarveyNet ownership server listening on port '
    + server.address().port + '...');
});
