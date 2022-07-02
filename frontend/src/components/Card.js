import React from 'react';
import CurrentUserContext from '../contexts/CurrentUserContext';

function Card(props) {
  const currentUser = React.useContext(CurrentUserContext);

  // Checking if the current user is the owner of the current card
  const isOwn = props.card.owner === currentUser._id;

  const cardDeleteButtonClassName = `element__button element__button_action_delete ${
    isOwn ? '' : 'element__button_inactive'
  }`;

  // Check if the card was liked by the current user
  const isLiked = props.card.likes.some((user) => user === currentUser._id);

  const cardLikeButtonClassName = `element__button element__button_action_like ${
    isLiked ? 'element__button_action_like_active' : ''
  }`;

  function handleClick() {
    props.onCardClick(props.card);
  }

  function handleLikeClick() {
    props.onCardLike(props.card);
  }

  function handleDeleteClick() {
    props.onCardDelete(props.card);
  }

  return (
    <article className='element'>
      <img
        className='element__image'
        src={props.card.link}
        alt={props.card.name}
        onClick={handleClick}
      />
      <button
        className={cardDeleteButtonClassName}
        type='button'
        aria-label='delete'
        onClick={handleDeleteClick}
      ></button>
      <div className='element__wrap'>
        <h2 className='element__title'>{props.card.name}</h2>
        <div className='element_like-container'>
          <button
            className={cardLikeButtonClassName}
            type='button'
            aria-label='like'
            onClick={handleLikeClick}
          ></button>
          <p className='element__like-counter'>{props.card.likes.length}</p>
        </div>
      </div>
    </article>
  );
}

export default Card;
