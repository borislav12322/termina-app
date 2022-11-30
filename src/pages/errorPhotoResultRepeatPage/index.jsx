import React from 'react';

import ErrorPage from '../../components/errorPage';
import { routesPaths } from '../../constans/routesPathes';

const ErrorPhotoResultRepeatPage = () => {
  const textErrorOne = 'Фотография посетителя не совпадает с фотографией в паспорте';

  const textErrorTwo = 'Пожалуйста, обратитесь в Бюро пропусков';

  return (
    <ErrorPage
      title="Ошибка"
      textOne={textErrorOne}
      textTwo={textErrorTwo}
      isRepeatButtonVisible
      errorPagePath={routesPaths.takePhoto}
    />
  );
};

export default ErrorPhotoResultRepeatPage;
