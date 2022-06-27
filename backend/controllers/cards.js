const Card = require('../models/card');
const NotFoundError = require('../errors/notfounderror');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() =>
      res.status(500).send({ message: 'Error: unable to get cards' })
    );
};

const addCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Unable to create card' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findOneAndRemove({ _id: req.params.cardId, owner: req.user._id })
    .orFail(() => {
      throw new NotFoundError('Unable to get card to delete');
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(err.statusCode).send({ Error: err.message });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Not valid  data' });
      } else {
        res
          .status(500)
          .send({ message: 'Server error. Unable to delete card' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError('Unable to find a card');
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(err.statusCode).send({ Error: err.message });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Not valid  data' });
      } else {
        res
          .status(500)
          .send({ message: 'Server error. Unable to like a card' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new NotFoundError('Unable to find a card');
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        res.status(err.statusCode).send({ Error: err.message });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Not valid  data' });
      } else {
        res
          .status(500)
          .send({ message: 'Server error. Unable to unlike a card' });
      }
    });
};

module.exports = {
  getCards,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
