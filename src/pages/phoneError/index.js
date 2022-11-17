import React from 'react';

import ErrorPage from '../../components/errorPage';
import { routesPaths } from '../../constans/routesPathes';

const PhoneError = () => {
  const textError = 'Пожалуйста, введите номер телефона заново';

  return (
    <ErrorPage
      title="Пропуск не найден"
      textOne={textError}
      isRepeatButtonVisible
      errorPagePath={routesPaths.phoneNumber}
    />
  );
};

export default PhoneError;
