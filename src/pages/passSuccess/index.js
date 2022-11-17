import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import PassSuccessImage from '../../assets/images/pass-success.png';
import Title from '../../components/title';
import { routesPaths } from '../../constans/routesPathes';

import s from './passSuccess.module.css';

const PassSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const intervalReturn = setInterval(() => {
      navigate(routesPaths.login);
    }, 10000);

    return () => clearInterval(intervalReturn);
  }, []);

  return (
    <div className={s.passSuccess}>
      <Title text="Пропуск выдан" />

      <div className={`${s.wrapper} wrapperShadow`}>
        <p className="commonText">
          Пожалуйста,
          <br /> возьмите Ваш пропуск
        </p>
        <img className={s.image} src={PassSuccessImage} alt="успешно выдан" />
      </div>
    </div>
  );
};

export default PassSuccess;
