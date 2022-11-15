import React from 'react';

import Button from '../button';

import s from './errorPage.module.css';

const ErrorPage = ({ title, textOne, isRepeatButtonVisible, textTwo }) => {
  const onClickHandle = e => {
    e.preventDefault();
  };

  return (
    <div className={s.errorPage}>
      <div className={s.wrapper}>
        <h2 className={`${s.title} commonTitle`}>{title}</h2>
        <div className={s.textBox}>
          {textOne && <p className={`${s.text} commonText`}>{textOne}</p>}
          {textTwo && <p className={`${s.text} commonText`}>{textTwo}</p>}
        </div>

        <div />
      </div>
      {isRepeatButtonVisible && (
        <Button text="Повторить" paddingLeftRight="30px" id="repeatButtonError" />
      )}
    </div>
  );
};

export default ErrorPage;
