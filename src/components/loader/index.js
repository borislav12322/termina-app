import React from 'react';

import loader from '../../assets/images/loader.png';

import s from './loader.module.css';

const Loader = () => {
  return (
    <div className={s.loader}>
      <div className={s.wrapper}>
        <img src={loader} alt="загрузка" />
      </div>
    </div>
  );
};

export default Loader;
