const { Server } = require('http');
const auth0 = require('auth0');

const AuthManager = require('./auth-manager');
const MachineManager = require('./machine-manager');
const makeApp = require('./make-app');


// auth client
const domain = 'dev-gltebumz.eu.auth0.com';  // env
const clientId = 'YH7GRHyV7jZQPaXwl9biw50ljZII8a46';  // env
const authClient = new auth0.AuthenticationClient({ domain, clientId });

const authManager = new AuthManager();

// machine manager
const machineManager = new MachineManager();

// server
const server = new Server(makeApp({ authManager, machineManager }));
const port = process.env.PORT || 3002;
server.listen(port, () => {
  console.log('HarveyNet ownership server listening on port '
    + server.address().port + '...');
});
