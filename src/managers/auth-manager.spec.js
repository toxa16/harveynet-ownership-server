const AuthManager = require('./auth-manager');
const Unauthorized = require('../errors/unauthorized');


// fixture
const testUserInfo = {
  email: 'test@email.com',
};
// stub
const auth0client = {
  users: {
    getInfo: async token => testUserInfo,
  },
};


describe('AuthManager', () => {
  describe('authenticateUserByHeader()', () => {
    describe('on successful authentication', () => {
      it('should resolve with `auth0client` user info', async () => {
        const authHeader = 'Bearer TEST_TOKEN';
        const authManager = new AuthManager(auth0client);
        const actualUserInfo = await authManager
          .authenticateUserByHeader(authHeader);
        expect(actualUserInfo).toEqual(testUserInfo);
      });
    });

    describe('on invalid authentication', () => {
      it('should reject with an `Unauthorized` error', async () => {
        const auth0client = {
          users: {
            getInfo: async token => {
              throw new Error();
            },
          },
        };
        const authHeader = 'Bearer TEST_TOKEN';
        const authManager = new AuthManager(auth0client);
        try {
          await authManager.authenticateUserByHeader(authHeader);
        } catch(err) {
          expect(err).toBeInstanceOf(Unauthorized);
        }
      });
    });

    describe('when there is no Authorization `header`', () => {
      it('should throw an `Unauthorized` error', () => {
        const authManager = new AuthManager();
        expect(() => {
          authManager.authenticateUserByHeader();
        }).toThrow(Unauthorized);
      });
    });

    describe('when Authorization `header` is not a Bearer token', () => {
      it('should throw an `Unauthorized` error', () => {
        const nonBearerHeader = 'Basic TEST_TOKEN';
        const authManager = new AuthManager(auth0client);
        expect(() => {
          authManager.authenticateUserByHeader(nonBearerHeader);
        }).toThrow(Unauthorized);
      })
    });
  });
});
