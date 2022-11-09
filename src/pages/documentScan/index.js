import React from 'react';

import TerminalImage from '../../assets/images/scaning.png';

import s from './documentScan.module.css';

const DocumentScan = () => {
  return (
    <div className={s.documentScan}>
      <div className={`${s.wrapper} wrapperShadow`}>
        <p className={`${s.text} commonText`}>
          Приложите паспорт <br /> к считывателю и дождитесь завершения сканирования
        </p>
        <img src={TerminalImage} alt="терминал" />
      </div>
    </div>
  );
};

export default DocumentScan;
