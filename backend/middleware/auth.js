const jwt = require('jsonwebtoken');
const LoginError = require('../errors/loginerror');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log(authorization);
    throw new LoginError('Authorization required');
  }

  const token = authorization.replace('Bearer ', '');
  console.log(`token: ${token}`);

  let payload;
  try {
    payload = jwt.verify(token, 'secret-string');
  } catch (err) {
    throw new LoginError('Authorization required');
  }
  console.log(`payload: ${JSON.stringify(payload)}\n`);
  req.user = payload;
  next();
};
