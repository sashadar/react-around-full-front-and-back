const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');

const auth = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const { requestLogger, errorLogger } = require('./middleware/logger');

const NotFoundError = require('./errors/notfounderror');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb7', {
  useNewUrlParser: true,
});

app.use(helmet());
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/cards', auth, cardsRouter);
app.use('/users', auth, usersRouter);

app.use('/', (req, res) => {
  throw new NotFoundError('Requested resource not found');
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
