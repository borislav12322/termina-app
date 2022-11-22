import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../components/button';
import Input from '../../components/input';
import Keyboard from '../../components/keyboard';
import { routesPaths } from '../../constans/routesPathes';
import { phone } from '../../DAL/api';
import { App } from '../../store';

import s from './phoneNumber.module.css';

const PhoneNumber = () => {
  const navigate = useNavigate();

  const [inputValues, setInputValues] = useState('');

  const onChange = e => {
    const { value, name } = e.currentTarget;

    setInputValues(value);
  };

  const isKeyboardVisible = App.useState(s => s.app.isKeyboardVisible);

  const sendNumber = async e => {
    e.preventDefault();

    try {
      const passData = await phone.search(inputValues);

      if (passData.length > 0) {
        App.update(s => {
          s.app.currentVisitorPassportID = passData[0].visitor_id;
          s.app.currentVisitorPassID = passData[0].id;
        });

        console.log(passData[0]?.id);

        navigate(routesPaths.documentScan);

        return;
      }

      if (passData.length === 0) {
        navigate(routesPaths.phoneError);

        return;
      }
    } catch (e) {
      navigate(routesPaths.phoneError);
    }
  };

  const backButtonHandle = e => {
    e.preventDefault();
    navigate(routesPaths.searchChosen);
  };

  return (
    <div className={s.phoneNumber}>
      <Button
        text="Назад"
        type="button"
        paddingLeftRight="36px"
        onClick={backButtonHandle}
        id="button_prev"
      />
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
