import React from 'react';

import Header from './Header';
import Footer from './Footer';

import Card from './Card';

import CurrentUserContext from '../contexts/CurrentUserContext';

function Main(props) {
  const currentUser = React.useContext(CurrentUserContext);

  return (
    <>
      <Header
        linkTitle='Log out'
        linkTo='signin'
        email={props.currentUserEmail}
        onClick={() => {
          localStorage.removeItem('token');
        }}
      />
      <main className='main'>
        <section className='profile'>
          <div
            className='profile__avatar-overlay'
            onClick={props.onEditAvatarClick}
          >
            <img className='avatar' src={currentUser.avatar} alt='Avatar' />
          </div>

          <div className='profile-info'>
            <h1 className='profile-info__name'>{currentUser.name} </h1>
            <button
              className='profile-info__button-edit'
              type='button'
              aria-label='edit'
              onClick={props.onEditProfileClick}
            ></button>
            <p className='profile-info__job'>{currentUser.about}</p>
          </div>
          <button
            className='profile__button-add'
            type='button'
            aria-label='add'
            onClick={props.onAddPlaceClick}
          ></button>
        </section>
        <section className='elements'>
          {props.cards.map((cardData) => (
            <Card
              key={cardData._id}
              card={cardData}
              onCardClick={props.onCardClick}
              onCardLike={props.onCardLike}
              onCardDelete={props.onCardDelete}
            />
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default Main;
