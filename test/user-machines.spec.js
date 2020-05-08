const supertest = require('supertest');

const makeApp = require('../src/make-app');
const Unauthorized = require('../src/errors/unauthorized');


// fixture
const testMachines = [
  {
    userId: 'test-user',
    machineId: 'test-machine-1',
  },
  {
    userId: 'test-user',
    machineId: 'test-machine-1',
  },
];


describe('User Machines Endpoint "/me/machines"', () => {
  it('should return machines from the `machineManager`', done => {
    // stubs
    const authManager = {
      authenticateUserByHeader: async header => {},
    }
    const machineManager = {
      getUserMachines: async userId => testMachines,
    };
    // SUT
    const app = makeApp({ authManager, machineManager });
    // test
    supertest(app)
      .get('/me/machines')
      .expect(200, testMachines)
      .end(done);
  });

  it('should respond with 500 on `machineManager` error', done => {
    // stubs
    const authManager = {
      authenticateUserByHeader: async header => {},
    }
    const machineManager = {
      getUserMachines: async userId => { throw new Error() },
    };
    // SUT
    const app = makeApp({ authManager, machineManager });
    // test
    supertest(app)
      .get('/me/machines')
      .expect(500)
      .end(done);
  });

  it('should respond with 401 on `authManager` `Unauthorized` error', done => {
    // stub
    const authManager = {
      authenticateUserByHeader: async header => {
        throw new Unauthorized();
      },
    };
    const machineManager = {
      getUserMachines: async userId => {},
    };
    // SUT
    const app = makeApp({ authManager, machineManager });
    // test
    supertest(app)
      .get('/me/machines')
      .expect(401)
      .end(done);
  });
});
