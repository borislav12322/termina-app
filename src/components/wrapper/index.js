import React from 'react';

import { Outlet } from 'react-router-dom';

import { App } from '../../store';
import Footer from '../footer';
import Header from '../header';
import Loader from '../loader';

import s from './wrapper.module.css';

const Wrapper = () => {
  const isLoading = App.useState(s => s.app.isLoading);

  const foundFacePassPhoto = App.useState(s => s.app.foundFacePassPhoto);

  console.log(App.getRawState().app.appConfig.mainURL);

  return (
    <div className={s.wrapper}>
      <Header />
      {isLoading ? <Loader /> : <Outlet />}
      <Footer />
    </div>
  );
};

export default Wrapper;
