const User = require('../models/user');
const NotFoundError = require('../errors/notfounderror');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(500).send({ message: 'unable to get Users' }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId === 'me' ? req.user._id : req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Unable to get user data');
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(err.statusCode).send({ Error: err.message });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Not valid data' });
      } else {
        res
          .status(500)
          .send({ message: 'Server error. Unable to get user by Id' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    User.create({ name, about, avatar, email, password: hash })
      .then((user) => res.status(201).send({ data: user }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: err.message });
        }
      });
  });
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
    .catch((err) => {
      if (err.name === 'LoginError') {
        res.status(err.statusCode).send({ message: err.message });
      }
      res.status(500).send({ message: 'Server error. Unable to login' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new NotFoundError('Unable to get user data');
    })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(err.statusCode).send({ Error: err.message });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res
          .status(500)
          .send({ message: 'Server error. Unable to update user data' });
      }
    });
};

const updateAvatar = (req, res) => {
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
      if (err.name === 'NotFoundError') {
        res.status(err.statusCode).send({ Error: err.message });
      } else if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res
          .status(500)
          .send({ message: 'Server error. Unable to update avatar' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  login,
  updateUser,
  updateAvatar,
};
