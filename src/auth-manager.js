class AuthManager {
  /**
   * Authenticates user by Bearer token from `Authorization` header.
   * @param {string} header request `Authorization` header
   * @returns {object} user info
   * @throws {Unauthorized}
   */
  async authenticateUserByHeader(header) {
    return {};
  }
}

module.exports = AuthManager;
