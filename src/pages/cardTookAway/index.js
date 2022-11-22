import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import PassSuccessImage from '../../assets/images/pass-success.png';
import Title from '../../components/title';
import { routesPaths } from '../../constans/routesPathes';

import s from './cardTookAway.module.css';

const CardTookAway = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const intervalReturn = setInterval(() => {
      navigate(routesPaths.login);
    }, 10000);

    return () => clearInterval(intervalReturn);
  }, []);

  return (
    <div className={s.cardTookAway}>
      <Title text="Пропуск не забран" />

      <div className={`${s.wrapper} wrapperShadow`}>
        <p className="commonText">
          Вы будете перенаправлены <br /> на главную страницу
        </p>
        <img className={s.image} src={PassSuccessImage} alt="успешно выдан" />
      </div>
    </div>
  );
};

export default CardTookAway;
