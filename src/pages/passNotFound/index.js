import React from 'react';

import ErrorPage from '../../components/errorPage';
import { routesPaths } from '../../constans/routesPathes';

import s from './passNotFound.module.css';

const PassNotFound = () => {
  const textError = 'Пожалуйста, попробуйте заново или обратитесь в бюро пропусков';

  return (
    <ErrorPage
      title="Пропуск по лицу не найден"
      textOne={textError}
      isRepeatButtonVisible
      errorPagePath={routesPaths.foundFace}
    />
  );
};

export default PassNotFound;
