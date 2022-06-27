const jwt = require('jsonwebtoken');
const LoginError = require('../errors/loginerror');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new LoginError('Authorization required');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, 'secret-string');
  } catch (err) {
    throw new LoginError('Authorization required');
  }
  req.user = payload;
  next();
};
