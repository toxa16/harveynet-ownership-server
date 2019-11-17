const supertest = require('supertest');

const app = require('../../src/app');
const ownershipFixture = require('../fixtures/ownership');

describe('User Machines Endpoint', () => {
  it('should return existing user\'s machines', done => {
    supertest(app)
      .get('/me/machines?username=alice')
      .end((err, res) => {
        if (err) return done(err);
        const expectedMachines = ownershipFixture[0].machines;
        expect(res.body).toStrictEqual({ data: expectedMachines });
        done();
      });
  });

  it('should return empty array [] on non-existing user', done => {
    supertest(app)
      .get('/me/machines?username=charlie')
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual({ data: [] });
        done();
      });
  });

  it('should return empty array [] on blank username', done => {
    supertest(app)
      .get('/me/machines')
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual({ data: [] });
        done();
      });
  });
});
