import React from 'react';

function PopupWithForm(props) {
  return (
    <section className={`popup  ${props.isOpen ? 'popup_opened' : ''}`}>
      <div className={`popup__container popup__container_content_form`}>
        <button
          type='button'
          className='popup__button-close popup__button-close_content_form'
          aria-label='close'
          onClick={props.onClose}
        ></button>

        <form
          className='form popup__form'
          name={props.name}
          onSubmit={props.onSubmit}
        >
          <h2 className='popup__title'>{props.title}</h2>
          {props.children}
          <button
            type='submit'
            className='form__button-submit popup__button'
            aria-label='save'
          >
            {props.buttonText}
          </button>
        </form>
      </div>
    </section>
  );
}

export default PopupWithForm;
