import React from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../components/button';
import Text from '../../components/text';
import Title from '../../components/title';

import s from './take-photo.module.css';

const TakePhoto = () => {
  const navigate = useNavigate();

  const buttonHandle = e => {
    e.preventDefault();
  };

  return (
    <div className={s.takePhoto}>
      <div className={s.wrapper}>
        <Title text="Требуется сделать фото" />
        <div className={s.textInner}>
          <Text text="Проход осуществляется по двухфакторной аутентификации" />
          <Text text="Встаньте в зону распознавания камеры" />
        </div>
      </div>

      <Button
        text="Далее"
        type="button"
        paddingLeftRight="36px"
        onClick={buttonHandle}
        id="button_next"
      />
    </div>
  );
};

export default TakePhoto;
