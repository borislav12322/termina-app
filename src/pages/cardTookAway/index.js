import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import PassSuccessImage from '../../assets/images/pass-success.png';
import Title from '../../components/title';
import { routesPaths } from '../../constans/routesPathes';
import { App } from '../../store';

import s from './cardTookAway.module.css';

const CardTookAway = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const intervalReturn = setInterval(() => {
      navigate(routesPaths.login);
    }, 10000);

    return () => clearInterval(intervalReturn);
  }, []);

  useEffect(() => {
    App.update(s => {
      s.app.currentVisitorPassportID = null;
      s.app.currentVisitorPassID = null;
      s.app.foundFacePassPhoto = null;
      s.app.documentVisitorData = null;
      s.app.terminalVisitorPhoto = null;
      s.app.dispenserInfo = null;
      s.app.currentVisitorID = null;
    });
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
