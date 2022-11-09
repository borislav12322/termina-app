import React from 'react';

import ErrorPage from '../../components/errorPage';

const ErrorPhotoResultPage = () => {
  const textError = 'Фотография посетителя не совпадает с фотографией в паспорте';

  return <ErrorPage title="Ошибка" textOne={textError} isRepeatButtonVisible />;
};

export default ErrorPhotoResultPage;
