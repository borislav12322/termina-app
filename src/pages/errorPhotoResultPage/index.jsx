import React from 'react';

import ErrorPage from '../../components/errorPage';
import { routesPaths } from '../../constans/routesPathes';

const ErrorPhotoResultPage = () => {
  const textError = 'Фотография посетителя не совпадает с фотографией в паспорте';

  return (
    <ErrorPage
      title="Ошибка"
      textOne={textError}
      isRepeatButtonVisible
      errorPagePath={routesPaths.takePhoto}
    />
  );
};

export default ErrorPhotoResultPage;
