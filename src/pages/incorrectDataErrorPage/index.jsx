import React from 'react';

import ErrorPage from '../../components/errorPage';

const IncorrectDataErrorPage = () => {
  const textError =
    'Если отсканированные данныене совпадают с данными Вашего паспорта, пожалуйста, обратитесь в Бюро Пропусков';

  return <ErrorPage title="Неккоректные данные" textOne={textError} />;
};

export default IncorrectDataErrorPage;
