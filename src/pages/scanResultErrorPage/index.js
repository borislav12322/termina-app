import React from 'react';

import ErrorPage from '../../components/errorPage';

const ScanResultErrorPage = () => {
  const textError = 'Пожалуйста, обратитесь в Бюро Пропусков';

  return (
    <ErrorPage
      title="Сканирование документа не выполнено"
      textOne={textError}
      isRepeatButtonVisible
    />
  );
};

export default ScanResultErrorPage;
