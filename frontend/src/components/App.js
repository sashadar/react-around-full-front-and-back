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
    const isLiked = card.likes.some((user) => user._id === currentUser._id);

    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards(() =>
          cards.map((currentCard) =>
            currentCard._id === card._id ? newCard : currentCard
          )
        );
      })
      .catch((err) => {
        console.log(`${err}`);
      });
  }

  function handleCardDelete(card) {
    api
      .removeCard(card._id)
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
      .setUserData({ name, about })
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Error:     ${err}`);
      });
  }

  function handleUpdateAvatar({ avatarLink }) {
    api
      .setUserAvatar(avatarLink)
      .then((userData) => {
        setCurrentUser(userData);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Error:     ${err}`);
      });
  }

  function handleAddPlaceSubmit({ name, link }) {
    api
      .addNewCard({ name, link })
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(`Error:     ${err}`);
      });
  }

  React.useEffect(() => {
    api
      .getInitialData()
      .then(([userData, initialCardsData]) => {
        setCurrentUser(userData);
        setCards(initialCardsData);
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
    if (token) {
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
