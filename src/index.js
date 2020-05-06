const { Server } = require('http');
const auth0 = require('auth0');

const makeApp = require('./make-app');

const domain = 'dev-gltebumz.eu.auth0.com';  // env
const clientId = 'YH7GRHyV7jZQPaXwl9biw50ljZII8a46';  // env
const authClient = new auth0.AuthenticationClient({ domain, clientId });


const server = new Server(makeApp(authClient));


const port = process.env.PORT || 3002;
server.listen(port, () => {
  console.log('HarveyNet ownership server listening on port '
    + server.address().port + '...');
});
