import React from 'react';
import { Link } from 'react-router-dom';

import Header from './Header.js';

function Login({ handleLoginSubmit, email, setEmail, password, setPassword }) {
  return (
    <>
      <Header linkTitle='Sign up' linkTo='./signup' />
      <form
        className='form form_auth'
        name='login'
        onSubmit={handleLoginSubmit}
      >
        <h2 className='popup__title popup__title_type_auth'>Log in</h2>
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
          aria-label='submit'
        >
          Log in
        </button>
        <Link to='signup' className='link'>
          Not a member yet? Sign up here!
        </Link>
      </form>
    </>
  );
}

export default Login;
