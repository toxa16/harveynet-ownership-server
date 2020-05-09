const Unauthorized = require('../errors/unauthorized');


// valid admin credentials
const adminUsername = 'admin';
const adminPassword = 'admin';


class AuthManager {
  constructor(auth0client) {
    this.auth0client = auth0client;
  }

  /**
   * Authenticates admin by Basic authentication scheme.
   * Valid admin credentials are HARD-CODED.
   * @param {string} authHeader 
   */
  authenticateAdmin(authHeader) {
    if (!authHeader) {
      throw new Unauthorized('No Authorization header.');
    }
    const token = authHeader.split('Basic ')[1];
    if (!token) {
      throw new Unauthorized('Only Basic authentication scheme is supported.');
    }
    const credStr = Buffer.from(token, 'base64').toString('utf-8');
    if (credStr !== `${adminUsername}:${adminPassword}`) {
      throw new Unauthorized('Invalid admin credentials.');
    }
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
        throw new Unauthorized('Authentication failed.');
      });
  }
}

module.exports = AuthManager;
