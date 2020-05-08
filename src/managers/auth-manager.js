const Unauthorized = require('../errors/unauthorized');


class AuthManager {
  constructor(auth0client) {
    this.auth0client = auth0client;
  }

  /**
   * Authenticates user by Bearer token from `Authorization` header.
   * @param {string} header request `Authorization` header
   * @returns {object} user info
   * @throws {Unauthorized}
   */
  authenticateUserByHeader(header) {
    if (!header) {
      throw new Unauthorized();
    }
    return this.auth0client.users.getInfo();
  }
}

module.exports = AuthManager;
