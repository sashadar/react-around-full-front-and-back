import React from 'react';
import logo from '../images/logo/header-logo.svg';
import { Link } from 'react-router-dom';

function Header(props) {
  return (
    <header className='header'>
      <img className='header__logo' src={logo} alt='Around the U.S. logo' />
      {props.linkTitle && (
        <div className='header__link-container'>
          {props.email && <p className='header__email'>{props.email}</p>}
          <Link
            className='header__link'
            to={props.linkTo}
            onClick={props.onClick}
          >
            {props.linkTitle}
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
