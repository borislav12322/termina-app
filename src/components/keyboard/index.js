import React, { useState } from 'react';

import { App } from '../../store';

import s from './keyboard.module.css';

const Keyboard = ({ setValue }) => {
  const numberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const onClickHandle = (e, value) => {
    e.preventDefault();

    setValue(oldValue => oldValue + value);
  };

  const deleteButton = e => {
    e.preventDefault();

    setValue('');
  };

  const clearLastCharacter = e => {
    e.preventDefault();
    setValue(oldValue => oldValue.slice(0, -1));
  };

  return (
    <div className={s.keyboard}>
      <div className={s.wrapper}>
        <button
          className={s.button}
          style={{ height: '200px' }}
          onClick={e => {
            e.preventDefault();
            App.update(s => {
              s.app.isKeyboardVisible = false;
            });
          }}
        >
          Закрыть
        </button>
        <div className={s.inner}>
          {numberArray.map(el => (
            <button
              key={el}
              type="button"
              className={s.button}
              onClick={e => onClickHandle(e, el)}
            >
              {el}
            </button>
          ))}
          <button className={s.button} onClick={clearLastCharacter}>
            {'<'}{' '}
          </button>
          <button className={s.button} onClick={e => onClickHandle(e, 0)}>
            0
          </button>
          <button className={s.button} onClick={deleteButton}>
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};

export default Keyboard;
