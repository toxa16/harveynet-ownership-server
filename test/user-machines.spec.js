const supertest = require('supertest');

const makeApp = require('../src/make-app');


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
    // stub
    const machineManager = {
      getUserMachines: async userId => testMachines,
    };
    // SUT
    const app = makeApp({ machineManager });
    // test
    supertest(app)
      .get('/me/machines')
      .expect(200, testMachines)
      .end(done);
  });

  it('should respond with 500 on `machineManager` error', done => {
    // stub
    const machineManager = {
      getUserMachines: async userId => { throw new Error() },
    };
    // SUT
    const app = makeApp({ machineManager });
    // test
    supertest(app)
      .get('/me/machines')
      .expect(500)
      .end(done);
  });
});
