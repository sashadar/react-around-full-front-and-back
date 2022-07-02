class InputValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = 'InputValidationError';
  }
}

module.exports = InputValidationError;
