import React from 'react';

function Footer() {
  return (
    <footer className='footer'>
      <p className='copyright'>
        &copy; {new Date().getFullYear()} Around The U.S.
      </p>
    </footer>
  );
}

export default Footer;
