const router = require('express').Router();
const { validateURL } = require('../validators/validators');
const { celebrate, Joi } = require('celebrate');
const {
  getCards,
  addCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required.custom(validateURL),
    }),
  }),
  addCard
);
router.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex(),
    }),
  }),
  deleteCard
);
router.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex(),
    }),
  }),
  likeCard
);

router.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().required().hex(),
    }),
  }),
  dislikeCard
);

module.exports = router;
