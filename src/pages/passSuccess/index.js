import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import PassSuccessImage from '../../assets/images/pass-success.png';
import Title from '../../components/title';
import { routesPaths } from '../../constans/routesPathes';
import { App } from '../../store';

import s from './passSuccess.module.css';

const PassSuccess = () => {
  const navigate = useNavigate();

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

  const dispenserInfo = App.useState(s => s.app.dispenserInfo);

  useEffect(() => {
    if (dispenserInfo && dispenserInfo?.data?.status === 'empty bin') {
      navigate(routesPaths.emptyBin);
    }
  }, [dispenserInfo]);

  useEffect(() => {
    const intervalReturn = setInterval(() => {
      navigate(routesPaths.login);
    }, 30000);

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
