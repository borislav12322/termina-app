import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../components/button';
import TextField from '../../components/textField';
import { routesPaths } from '../../constans/routesPathes';
import { passport } from '../../DAL/api';
import { App } from '../../store';

import s from './documentFields.module.css';

const DocumentFields = () => {
  const visitorInfo = App.useState(
    s => s.app.documentVisitorData?.OcrFields?.DocVisualExtendedInfo?.pArrayFields,
  );

  const currentVisitorData = App.useState(s => s.app.documentVisitorData);

  const currentVisitorPassportID = App.useState(s => s.app.currentVisitorPassportID);

  const navigate = useNavigate();

  const onButtonInCorrectHandle = e => {
    e.preventDefault();
    navigate(routesPaths.documentScan);
  };

  const [inputValues, setInputValues] = useState({
    last_name: '',
    first_name: '',
    middle_name: '',
    birthday: '',
    number: '',
  });

  const { last_name, birthday, first_name, middle_name, number } = inputValues;

  const onChangeHandle = e => {
    const { value, name } = e.currentTarget;

    setInputValues(oldValue => ({ ...oldValue, [name]: value }));
  };

  const currentYear = new Date().getFullYear().toString().slice(-2);

  const modifiedData = visitorInfo && visitorInfo?.[8]?.Buf_Text;

  const year = modifiedData?.split('')?.slice(0, 2).join('');
  const month = modifiedData?.split('')?.slice(2, 4).join('');
  const day = modifiedData?.split('')?.slice(4, 6).join('');

  const fullYear = year > currentYear ? `19${year}` : `20${year}`;

  const photo = App.useState(s => s.app.documentVisitorData?.Image?.image);

  const passportPayload = {
    number: visitorInfo?.[5]?.Buf_Text,
    date_of_birth: `${fullYear}-${month}-${day}`,
  };

  const onButtonCorrectHandle = async e => {
    e.preventDefault();

    try {
      const passportData = await passport.add(passportPayload, currentVisitorPassportID);

      navigate(routesPaths.takePhoto);
    } catch (e) {
      console.error(e);
      navigate(routesPaths.emptyPassport);
    }
  };

  console.log(visitorInfo);

  return (
    <div className={s.documentFields}>
      <div className={s.wrapper}>
        <h2 className={`${s.title} commonTitle`}>Результат сканирования</h2>
        <div className={s.inputBox}>
          <TextField title="Фамилия" text={visitorInfo?.[22]?.Buf_Text} />
          <TextField title="Имя" text={visitorInfo?.[23]?.Buf_Text} />
          <TextField title="Отчество" text={visitorInfo?.[24]?.Buf_Text} />
          <TextField
            title="Дата рождения"
            text={`${day || ''}.${month || ''}.${fullYear || ''}`}
          />
          <TextField title="Серия и номер документа" text={visitorInfo?.[5]?.Buf_Text} />
        </div>
        <div className={s.currentBox}>
          <p className={`${s.text} commonText`}>
            Отсканированные данные совпадают с оригиналом документа?
          </p>
          <div className={s.buttonBox}>
            <Button
              text="Не совпадают"
              paddingLeftRight="64px"
              id="not_correct"
              buttonWhite
              onClick={onButtonInCorrectHandle}
            />

            <Button
              text="Совпадают"
              paddingLeftRight="96px"
              id="correct"
              onClick={onButtonCorrectHandle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentFields;
