import React from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../components/button';
import Time from '../../components/time';
import { routesPaths } from '../../constans/routesPathes';

import s from './login.module.css';

const Login = () => {
  const navigate = useNavigate();

  const onButtonClickHandle = e => {
    e.preventDefault();
    navigate(routesPaths.shareData);
  };

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
