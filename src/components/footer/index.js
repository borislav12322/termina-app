import React from 'react';

import HomeButton from '../homeButton';

import s from './footer.module.css';

const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={s.wrapper}>
        <HomeButton />
      </div>
    </footer>
  );
};

export default Footer;
