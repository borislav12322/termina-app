import React from 'react';

import ErrorPage from '../../components/errorPage';

const ErrorPhotoResultRepeatPage = () => {
  const textErrorOne = 'Фотография посетителя не совпадает с фотографией в паспорте';

  const textErrorTwo = 'Пожалуйста, обратитесь в Бюро пропусков';

  return (
    <ErrorPage
      title="Ошибка"
      textOne={textErrorOne}
      textTwo={textErrorTwo}
      isRepeatButtonVisible
    />
  );
};

export default ErrorPhotoResultRepeatPage;
