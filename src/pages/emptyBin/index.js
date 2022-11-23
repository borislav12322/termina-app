import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import ErrorPage from '../../components/errorPage';
import { routesPaths } from '../../constans/routesPathes';
import { App } from '../../store';

const EmptyBin = () => {
  const textError = 'Корзина с карточками пустая';
  const textErrorTwo = 'Пожалуйста, обратитесь в бюро пропусков';

  const navigate = useNavigate();

  useEffect(() => {
    const intervalReturn = setInterval(() => {
      navigate(routesPaths.login);
    }, 25000);

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

  return <ErrorPage title="Ошибка" textOne={textError} textTwo={textErrorTwo} />;
};

export default EmptyBin;
