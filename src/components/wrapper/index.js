import React from 'react';

import { Outlet } from 'react-router-dom';

import Footer from '../footer';
import Header from '../header';

import s from './wrapper.module.css';

const Wrapper = () => {
  return (
    <div className={s.wrapper}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Wrapper;
