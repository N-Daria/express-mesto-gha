const Card = require('../models/card');
const { OtherError } = require('../errors/OtherError');
const { UndefinedError } = require('../errors/UndefinedError');
const { ValidationError } = require('../errors/ValidationError');
const { IncorrectDataError } = require('../errors/IncorrectDataError');
const { createdSuccesCode } = require('../errors/responseStatuses');

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.status(createdSuccesCode).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const newErr = new ValidationError('Переданы некорректные данные');
        return res.status(newErr.statusCode).send({ message: newErr.message });
      }
      const otherErr = new OtherError('На сервере произошла ошибка');
      return res.status(otherErr.statusCode).send({ message: otherErr.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'UndefinedError') return res.status(err.statusCode).send({ message: err.message });

      if (err.name === 'CastError') {
        const newErr = new IncorrectDataError('Передан некорректный id');
        return res.status(newErr.statusCode).send({ message: newErr.message });
      }

      const otherErr = new OtherError('На сервере произошла ошибка');
      return res.status(otherErr.statusCode).send({ message: otherErr.message });
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      const otherErr = new OtherError('На сервере произошла ошибка');
      return res.status(otherErr.statusCode).send({ message: otherErr.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new UndefinedError('Запрашиваемая карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'UndefinedError') return res.status(err.statusCode).send({ message: err.message });

      if (err.name === 'CastError') {
        const newErr = new IncorrectDataError('Передан некорректный id');
        return res.status(newErr.statusCode).send({ message: newErr.message });
      }

      const otherErr = new OtherError('На сервере произошла ошибка');
      return res.status(otherErr.statusCode).send({ message: otherErr.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new UndefinedError('Запрашиваемая карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'UndefinedError') return res.status(err.statusCode).send({ message: err.message });

      if (err.name === 'CastError') {
        const newErr = new IncorrectDataError('Передан некорректный id');
        return res.status(newErr.statusCode).send({ message: newErr.message });
      }

      const otherErr = new OtherError('На сервере произошла ошибка');
      return res.status(otherErr.statusCode).send({ message: otherErr.message });
    });
};
