const supertest = require('supertest');

const makeApp = require('../src/make-app');
const Unauthorized = require('../src/errors/unauthorized');


/*const adminUsername = 'admin';
const adminPassword = 'admin';
const basicToken = Buffer
  .from(`${adminUsername}:${adminPassword}`, 'utf-8')
  .toString('base64');
const authHeader = `Basic ${basicToken}`;*/


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
    it('should respond with 200', done => {
      const authManager = {
        authenticateAdmin: () => {},
      };
      const app = makeApp({ authManager });
      supertest(app)
        .get('/admin/machines')
        .expect(200)
        .end(done);
    });
  });
});
