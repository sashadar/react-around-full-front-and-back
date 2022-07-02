const Card = require('../models/card');
const NotFoundError = require('../errors/notfounderror');
const InputValidationError = require('../errors/inputvalidationerror');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

const addCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new InputValidationError(
          'Input validation failed: unable to create card'
        );
      }
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findOneAndRemove({ _id: req.params.cardId, owner: req.user._id })
    .orFail(() => {
      throw new NotFoundError('A card to be deleted not found');
    })
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new NotFoundError('A card to be deleted not found');
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
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
      if (err.name === 'CastError') {
        throw new NotFoundError('Unable to find a card');
      }
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
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
      if (err.name === 'CastError') {
        throw new NotFoundError('Unable to find a card');
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
