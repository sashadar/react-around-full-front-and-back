class LoginError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
    this.name = 'LoginError';
  }
}

module.exports = LoginError;
