import React from 'react';

import { Link } from 'react-router-dom';

import Logo from '../../assets/images/mfua_logo.png';
import { routesPaths } from '../../constans/routesPathes';
import Time from '../time/index';

import s from './header.module.css';

const Header = () => {
  return (
    <header className={s.header}>
      <Link to={routesPaths.takePhoto}>photo</Link>
      <Link to={routesPaths.documentScan}>scan</Link>
      <div className={s.wrapper}>
        <img src={Logo} alt="логотип" />
        <Time header />
      </div>
    </header>
  );
};

export default Header;
