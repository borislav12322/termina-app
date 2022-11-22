import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import TerminalImage from '../../assets/images/scaning.png';
import { routesPaths } from '../../constans/routesPathes';
import { regula } from '../../DAL/api';
import { App } from '../../store';

import s from './documentScan.module.css';

const DocumentScan = () => {
  const [visitorData, setVisitorData] = useState(null);

  const navigate = useNavigate();

  console.log(App.useState(s => s.app.currentVisitorPassID));

  useEffect(() => {
    const serverEvent = new EventSource(
      `http://localhost:${
        process.env.NODE_ENV === 'development' ? '8081' : '8080'
      }/stream`,
      {
        withCredentials: false,
      },
    );

    serverEvent.addEventListener('DocumentReady', e => {
      if (e.data.match('true')) {
        regula.lastScan().then(res => {
          App.update(s => {
            s.app.documentVisitorData = res.data;
          });
        });
        navigate(routesPaths.documentFields);
      }
    });

    return () => serverEvent.close();
  }, []);

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
