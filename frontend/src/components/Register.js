import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Header.js';

function Register({
  handleRegisterSubmit,
  email,
  setEmail,
  password,
  setPassword,
}) {
  return (
    <>
      <Header linkTitle='Log in' linkTo='./signin' />
      <form
        className='form form_auth'
        name='register'
        onSubmit={handleRegisterSubmit}
      >
        <h2 className='popup__title popup__title_type_auth'>Sign up</h2>
        <input
          type='email'
          className='form__input form__input_auth'
          name='email'
          id='email-input'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          className='form__input form__input_auth'
          name='password'
          id='password-input'
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type='submit'
          className='form__button-submit form__button-submit_auth'
          aria-label='save'
        >
          Sign up
        </button>
        <Link to='signin' className='link'>
          Already a member? Log in here!
        </Link>
      </form>
    </>
  );
}

export default Register;
