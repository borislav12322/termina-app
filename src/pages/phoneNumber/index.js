import React, { useState } from 'react';

import Button from '../../components/button';
import Input from '../../components/input';
import Keyboard from '../../components/keyboard';
import { phone } from '../../DAL/api';
import { App } from '../../store';

import s from './phoneNumber.module.css';

const PhoneNumber = () => {
  const [inputValues, setInputValues] = useState('');

  console.log(inputValues);

  const onChange = e => {
    const { value, name } = e.currentTarget;

    setInputValues(value);
  };

  const isKeyboardVisible = App.useState(s => s.app.isKeyboardVisible);

  const sendNumber = async e => {
    e.preventDefault();

    try {
      const passData = await phone.search(inputValues);

      console.log(passData);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className={s.phoneNumber}>
      <div className={s.wrapper}>
        <Input
          title="Номер телефона"
          name="phone"
          value={inputValues}
          onChange={onChange}
          maxSymbols={11}
          type="text"
          onFocus={() => {
            App.update(s => {
              s.app.isKeyboardVisible = true;
            });
          }}
        />

        <Button text="Отправить" onClick={sendNumber} />
      </div>
      {isKeyboardVisible && <Keyboard setValue={setInputValues} />}
    </div>
  );
};

export default PhoneNumber;
