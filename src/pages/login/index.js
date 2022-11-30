import React, { useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../components/button';
import Time from '../../components/time';
import { routesPaths } from '../../constans/routesPathes';
import { App } from '../../store';

import s from './login.module.css';

const Login = () => {
  const navigate = useNavigate();

  const onButtonClickHandle = e => {
    e.preventDefault();
    navigate(routesPaths.shareData);
  };

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
    <div className={s.login}>
      <div className={s.wrapper}>
        <div />

        <div className={s.time}>
          <Time loginPage />
        </div>

        <Button
          text="Получить пропуск"
          type="button"
          paddingLeftRight="80px"
          onClick={onButtonClickHandle}
        />
      </div>
    </div>
  );
};

export default Login;
