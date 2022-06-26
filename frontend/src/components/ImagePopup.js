import React from 'react';

function ImagePopup(props) {
  return (
    <section className={`popup ${props.isOpen ? 'popup_opened' : ''}`}>
      <div className='popup__container popup__container_content_image'>
        <button
          type='button'
          className='popup__button-close popup__button-close_content_image'
          aria-label='close-popup-image'
          onClick={props.onClose}
        ></button>
        <img
          className='popup__image'
          src={props.card.link}
          alt={props.card.name}
        />
        <p className='popup__image-title'>{props.card.name}</p>
      </div>
    </section>
  );
}

export default ImagePopup;
