const supertest = require('supertest');

const app = require('../../src/app');

const ownershipFixture = [
  {
    username: 'alice',
    machines: [
      { id: 'machine1' },
      { id: 'machine2' },
    ]
  },
  {
    username: 'bob',
    machines: [
      { id: 'machine3' },
    ],
  },
];

describe('User Machines Endpoint', () => {
  it('should return existing user\'s machines', done => {
    supertest(app)
      .get('/me/machines?username=alice')
      .end((err, res) => {
        if (err) return done(err);
        const expectedMachines = ownershipFixture[0].machines;
        expect(res.body).toStrictEqual(expectedMachines);
        done();
      });
  });

  it('should return empty array [] on non-existing user', done => {
    supertest(app)
      .get('/me/machines?username=charlie')
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual([]);
        done();
      });
  });

  it('should return empty array [] on blank username', done => {
    supertest(app)
      .get('/me/machines')
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toEqual([]);
        done();
      });
  });
});
