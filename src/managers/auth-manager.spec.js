const AuthManager = require('./auth-manager');
const Unauthorized = require('../errors/unauthorized');


describe('AuthManager', () => {
  describe('authenticateUserByHeader()', () => {
    describe('on successful authentication', () => {
      it('should resolve with user info object from `auth0client`', async () => {
        const testUserInfo = {
          email: 'test@email.com',
        };
        const auth0client = {
          users: {
            getInfo: async token => testUserInfo,
          },
        };
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
        expect(authManager.authenticateUserByHeader).toThrow(Unauthorized);
      });
    });
  });
});
