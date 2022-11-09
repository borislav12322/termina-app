import React from 'react';

import Button from '../button';

import s from './errorPage.module.css';

const ErrorPage = ({ title, textOne, isRepeatButtonVisible, textTwo }) => {
  return (
    <div className={s.errorPage}>
      <div className={s.wrapper}>
        <h2 className={`${s.title} commonTitle`}>{title}</h2>

        {textOne && <p className={`${s.text} commonText`}>{textOne}</p>}
        {textTwo && <p className={`${s.text} commonText`}>{textTwo}</p>}

        {isRepeatButtonVisible && <Button text="Повторить" />}
        <div />
      </div>
    </div>
  );
};

export default ErrorPage;
