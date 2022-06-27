const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { createUser, login } = require('./controllers/users');
const auth = require('./middleware/auth');

const { PORT = 3000 } = process.env;

const app = express();

/* mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
}); */

mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
});

app.use(helmet());
app.use(bodyParser.json());

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/cards', auth, cardsRouter);
app.use('/users', auth, usersRouter);
app.use('/', (req, res) => {
  res.status(404);
  res.send(JSON.stringify({ message: 'Requested resource not found' }));
});

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});
