import React from 'react';

import ErrorPage from '../../components/errorPage';
import { routesPaths } from '../../constans/routesPathes';

const EmptyPassportField = () => {
  const textError = 'Паспортные данные не отсканированы';
  const textErrorTwo = 'Пожалуйста, отсканируйте паспорт повторно';

  return (
    <ErrorPage
      title="Ошибка"
      textOne={textError}
      textTwo={textErrorTwo}
      isRepeatButtonVisible
      errorPagePath={routesPaths.documentScan}
    />
  );
};

export default EmptyPassportField;
