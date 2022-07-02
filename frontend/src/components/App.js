import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute';
import Login from './Login';
import Register from './Register';
import Main from './Main';

import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import ImagePopup from './ImagePopup';
import AddPlacePopup from './AddPlacePopup';
import InfoTooltip from './InfoTooltip';

import api from '../utils/api';
import * as auth from '../utils/auth';

import CurrentUserContext from '../contexts/CurrentUserContext';

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState({});

  const [currentUser, setCurrentUser] = React.useState({});
  const [currentUserEmail, setCurrentUseremail] = React.useState(null);

  const [cards, setCards] = React.useState([]);

  const [loggedIn, setLoggedIn] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [infoTooltipTitle, setInfoTooltipTitle] = React.useState('');
  const [infoTooltipIcon, setInfoTooltipIcon] = React.useState('');
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);
  const [isRegistrationSuccess, setIsRegistrationSuccess] =
    React.useState(false);

  const history = useHistory();

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsInfoTooltipOpen(false);
    if (isRegistrationSuccess) {
      history.push('/signin');
      setIsRegistrationSuccess(false);
    }
  }

  function handleCardClick(card) {
    setSelectedCard(card);
    setIsImagePopupOpen(true);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((userId) => userId === currentUser._id);
    console.log(`handleCardLike(App.js): cardId to like: ${card._id}`);

    api
      .changeLikeCardStatus({
        cardId: card._id,
        isNotLiked: !isLiked,
        token: localStorage.getItem('token'),
      })
      .then((newCard) => {
        setCards(() =>
          cards.map((currentCard) =>
            currentCard._id === card._id ? newCard.data : currentCard
          )
        );
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  function handleCardDelete(card) {
    console.log(`handleCardDelete(App.js): card._id: ${card._id}`);
    api
      .removeCard({ cardId: card._id, token: localStorage.getItem('token') })
      .then(() =>
        setCards(() =>
          cards.filter((currentCard) =>
            currentCard._id !== card._id ? currentCard : null
          )
        )
      )
      .catch((err) => {
        console.log(`Error:     ${err}`);
      });
  }

  function handleUpdateUser({ name, about }) {
    api
      .setUserData({ name, about, token: localStorage.getItem('token') })
      .then((userData) => {
        setCurrentUser(userData.data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Error:     ${err}`);
      });
  }

  function handleUpdateAvatar({ avatarLink }) {
    api
      .setUserAvatar({ avatarLink, token: localStorage.getItem('token') })
      .then((userData) => {
        setCurrentUser(userData.data);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Error:     ${err}`);
      });
  }

  function handleAddPlaceSubmit({ name, link }) {
    api
      .addNewCard({ name, link, token: localStorage.getItem('token') })
      .then((newCard) => {
        setCards([newCard.data, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Error:     ${err}`);
      });
  }

  React.useEffect(() => {
    api
      .getInitialData({ token: localStorage.getItem('token') })
      .then(([userData, initialCardsData]) => {
        setCurrentUser(userData.data);
        console.log(`initialCardsData[0].name: ${initialCardsData}`);
        setCards(initialCardsData.data);
        console.log(`init cards[0]: ${cards[0]}`);
      })
      .catch((err) => {
        console.log(`Error:     ${err}`);
      });
  }, []);

  React.useEffect(() => {
    const closeByEscape = (e) => {
      if (e.key === 'Escape') {
        closeAllPopups();
      }
    };

    document.addEventListener('keydown', closeByEscape);

    return () => document.removeEventListener('keydown', closeByEscape);
  }, []);

  function setSuccessInfoTooltip() {
    setInfoTooltipTitle('Success! You have now been registered.');
    setInfoTooltipIcon('popup__icon_type_success');
    setIsRegistrationSuccess(true);
  }

  function setErrorInfoTooltip() {
    setInfoTooltipTitle('Oops, something went wrong! Please try again.');
    setInfoTooltipIcon('popup__icon_type_fail');
    setIsRegistrationSuccess(false);
  }

  function resetForm() {
    setEmail('');
    setPassword('');
  }

  const tokenCheck = () => {
    const token = localStorage.getItem('token');
    console.log(`\n App.js(front).tokencheck 0: token set to: ${token}`);
    if (token) {
      console.log(`\n App.js(front).tokencheck 1: token set to: ${token}`);
      auth
        .checkToken(token)
        .then((res) => {
          setCurrentUseremail(res.data.email);
          setLoggedIn(true);
          history.push('/');
        })
        .catch((err) => {
          console.log(`Error:     ${err}`);
        });
    }
  };

  React.useEffect(() => {
    tokenCheck();
  }, []);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    auth
      .register(email, password)
      .then((res) => {
        if (res.data) {
          setSuccessInfoTooltip();
        } else {
          setErrorInfoTooltip();
        }
      })
      .catch((err) => {
        console.log(`Error:     ${err}`);
        setErrorInfoTooltip();
      })
      .finally(() => {
        resetForm();
        setIsInfoTooltipOpen(true);
      });
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    auth
      .authorize(email, password)
      .then((data) => {
        if (data.token) {
          setLoggedIn(true);
          setCurrentUseremail(email);
          history.push('/');
        } else {
        }
      })
      .catch((err) => {
        console.log(`Error:     ${err}`);
        setErrorInfoTooltip();
        setIsInfoTooltipOpen(true);
        setLoggedIn(false);
      })
      .finally(() => {
        resetForm();
      });
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className='page'>
        <Switch>
          <Route path='/signin'>
            <Login
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleLoginSubmit={handleLoginSubmit}
            />
          </Route>
          <Route path='/signup'>
            <Register
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleRegisterSubmit={handleRegisterSubmit}
            />
          </Route>
          <ProtectedRoute
            path='/'
            loggedIn={loggedIn}
            currentUserEmail={currentUserEmail}
            component={Main}
            onEditAvatarClick={handleEditAvatarClick}
            onEditProfileClick={handleEditProfileClick}
            onAddPlaceClick={handleAddPlaceClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            cards={cards}
          />
        </Switch>
        <EditProfilePopup
          isOpen={isEditProfilePopupOpen}
          onClose={closeAllPopups}
          onUpdateUser={handleUpdateUser}
        />
        <EditAvatarPopup
          isOpen={isEditAvatarPopupOpen}
          onClose={closeAllPopups}
          onUpdateAvatar={handleUpdateAvatar}
        ></EditAvatarPopup>
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onClose={closeAllPopups}
          onAddPlaceSubmit={handleAddPlaceSubmit}
        ></AddPlacePopup>
        <InfoTooltip
          isOpen={isInfoTooltipOpen}
          onClose={closeAllPopups}
          title={infoTooltipTitle}
          icon={infoTooltipIcon}
        ></InfoTooltip>

        <ImagePopup
          isOpen={isImagePopupOpen}
          onClose={closeAllPopups}
          card={selectedCard}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
