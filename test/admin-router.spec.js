const supertest = require('supertest');

const makeApp = require('../src/make-app');
const Unauthorized = require('../src/errors/unauthorized');


// fixture
const testMachines = [
  {
    userId: 'test-user-1',
    machineId: 'test-machine-1',
  },
  {
    userId: 'test-user-2',
    machineId: 'test-machine-2',
  },
  {
    userId: 'test-user-2',
    machineId: 'test-machine-3',
  },
];

// stub
const authManager = {
  authenticateAdmin: () => {},
};


describe('Admin Router "/admin/*"', () => {
  it('should respond 401 on `authManager` Unauthorized error', done => {
    const authManager = {
      authenticateAdmin: () => { throw new Unauthorized() },
    };
    const app = makeApp({ authManager });
    supertest(app)
      .get('/admin')
      .expect(401)
      .end(done);
  });

  describe('GET /admin/machines', () => {
    it('should respond with machines from `getAllMachines()`', done => {
      // stub
      const machineManager = {
        getAllMachines: async () => testMachines,
      }
      // SUT
      const app = makeApp({ authManager, machineManager });
      // test
      supertest(app)
        .get('/admin/machines')
        .expect(200, testMachines)
        .end(done);
    });

    it('should respond with 500 on `getAllMachines()` error', done => {
      // stub
      const machineManager = {
        getAllMachines: async () => {
          throw new Error();
        },
      }
      // SUT
      const app = makeApp({ authManager, machineManager });
      // test
      supertest(app)
        .get('/admin/machines')
        .expect(500)
        .end(done);
    });
  });

  describe('POST /admin/machines', () => {
    it('should respond with 201 after successfull machine creation', done => {
      // stub
      const machineManager = {
        addMachine: async () => {},
      }
      // SUT
      const app = makeApp({ authManager, machineManager });
      // test
      supertest(app)
        .post('/admin/machines')
        .expect(201)
        .end(done);
    });

    it('should respond with 500 on `addMachine()` error', done => {
      // stub
      const machineManager = {
        addMachine: async () => {
          throw new Error();
        },
      }
      // SUT
      const app = makeApp({ authManager, machineManager });
      // test
      supertest(app)
        .post('/admin/machines')
        .expect(500)
        .end(done);
    });
  });
});
