const jwt = require('jsonwebtoken');
const LoginError = require('../errors/loginerror');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new LoginError('Authorization required');
  }

  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'secret-string'
    );
  } catch (err) {
    throw new LoginError('Authorization required');
  }

  req.user = payload;
  next();
};
