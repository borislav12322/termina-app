import React from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../button';

import s from './errorPage.module.css';

const ErrorPage = ({ title, textOne, isRepeatButtonVisible, textTwo, errorPagePath }) => {
  const navigate = useNavigate();

  const onClickHandle = e => {
    e.preventDefault();
    if (errorPagePath) {
      navigate(errorPagePath);
    }
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
        <Button
          text="Повторить"
          paddingLeftRight="30px"
          id="repeatButtonError"
          onClick={onClickHandle}
        />
      )}
    </div>
  );
};

export default ErrorPage;
