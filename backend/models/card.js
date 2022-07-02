const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maglength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(
        v /* {
        return /^(https?):\/\/(www\.)?[\w-]+\.[a-z]+\/?[\w.~:/?%#[\]@!$&'()*+,;=]*$/gm.test(
          v,
        );
      }, */
      ) {
        return /^(http:\/\/|https:\/\/)(www.)?[a-zA-Z0-9-._~:/?%#[\]@!$&'()*+,;=]+\.[a-zA-Z0-9-._~:/?%#[\]@!$&'()*+,;=]{2,}#?$/gim.test(
          v
        );
      },
      message: 'Not supported URL',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    ref: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
