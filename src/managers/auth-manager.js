const Unauthorized = require('../errors/unauthorized');


class AuthManager {
  constructor(auth0client) {
    this.auth0client = auth0client;
  }

  /**
   * Authenticates user by Bearer token from `Authorization` header.
   * @param {string} header request `Authorization` header
   * @returns {Promise<object>} user info
   * @throws {Unauthorized}
   */
  authenticateUserByHeader(header) {
    if (!header) {
      throw new Unauthorized('No Authorization header.');
    }
    const token = header.split('Bearer ')[1];
    if (!token) {
      throw new Unauthorized('Only Bearer tokens are supported.');
    }
    return this.auth0client.users.getInfo(token)
      .catch(err => {
        throw new Unauthorized();
      });
  }
}

module.exports = AuthManager;
