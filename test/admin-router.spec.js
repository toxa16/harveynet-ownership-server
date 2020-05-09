const supertest = require('supertest');

const makeApp = require('../src/make-app');


describe('Admin Router "/admin/*"', () => {
  describe('GET /admin/machines', () => {
    it('should respond with 200', done => {
      const app = makeApp({});
      supertest(app)
        .get('/admin/machines')
        .expect(200)
        .end(done);
    });
  });
});
