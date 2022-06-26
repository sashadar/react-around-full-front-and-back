import React from 'react';

function InfoTooltip(props) {
  return (
    <section className={`popup  ${props.isOpen ? 'popup_opened' : ''}`}>
      <div className={`popup__container popup__container_content_tooltip`}>
        <button
          type='button'
          className='popup__button-close popup__button-close_content_tooltip'
          aria-label='close'
          onClick={props.onClose}
        ></button>
        <div className={`popup__icon ${props.icon}`}></div>
        <h2 className='popup__title popup__title_type_tooltip'>
          {props.title}
        </h2>
      </div>
    </section>
  );
}

export default InfoTooltip;
