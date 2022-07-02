const User = require('../models/user');
const NotFoundError = require('../errors/notfounderror');
const InputValidationError = require('../errors/inputvalidationerror');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId === 'me' ? req.user._id : req.params.userId)
    .orFail(() => {
      throw new NotFoundError('User not found');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('User not found');
      }
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InputValidationError(
          'Input validation failed: unable to create user'
        );
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-string', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch(next);
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError('User not found');
    })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InputValidationError(
          'Input validation failed: unable to upfdate user data'
        );
      } else {
        throw err;
      }
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError('Unable to get user data');
    })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InputValidationError(
          'Input validation failed: unable to create card'
        );
      } else {
        throw err;
      }
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  updateUser,
  updateAvatar,
};
