const AuthManager = require('./auth-manager');
const Unauthorized = require('../errors/unauthorized');


// utility
function composeBasicHeader(username, password) {
  const creds = `${username}:${password}`;
  const token = Buffer.from(creds, 'utf-8').toString('base64');
  return `Basic ${token}`;
}


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

  describe('authenticateAdmin()', () => {
    describe('when to `authHeader` is set', () => {
      it('should throw `Unauthorized`', () => {
        const authManager = new AuthManager({});
        expect(() => {
          authManager.authenticateAdmin();
        }).toThrow(Unauthorized);
      });
    });

    describe('when `authHeader` is not a Basic token', () => {
      it('should throw `Unauthorized`', () => {
        const authHeader = 'Bearer TEST_TOKEN';
        const authManager = new AuthManager({});
        expect(() => {
          authManager.authenticateAdmin(authHeader);
        }).toThrow(Unauthorized);
      });
    });

    describe('on admin credentials othen than "admin:admin"', () => {
      it('should throw `Unauthorized`', () => {
        // credentials & auth header
        const username = 'admin';
        const password = 'INVALID_PASSWORD';
        const authHeader = composeBasicHeader(username, password);
        // SUT
        const authManager = new AuthManager({});
        // test
        expect(() => {
          authManager.authenticateAdmin(authHeader);
        }).toThrow(Unauthorized);
      });
    });

    describe('on admin credentials "admin:admin" (valid)', () => {
      it('should not throw any error', () => {
        // credentials & auth header
        const username = 'admin';
        const password = 'admin';
        const authHeader = composeBasicHeader(username, password);
        // SUT
        const authManager = new AuthManager({});
        // test
        expect(() => {
          authManager.authenticateAdmin(authHeader);
        }).not.toThrow();
      });
    });
  });
});
