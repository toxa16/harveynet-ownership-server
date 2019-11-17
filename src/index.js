const { Server } = require('http');

const app = require('./app');

const server = new Server(app);

const port = 3001;
server.listen(port, () => {
  console.log('HarveyNet ownership server listening on port '
    + server.address().port + '...');
});
