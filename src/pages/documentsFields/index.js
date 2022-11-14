import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../components/button';
import Input from '../../components/input';
import { routesPaths } from '../../constans/routesPathes';
import { App } from '../../store';

import s from './documentFields.module.css';

const DocumentFields = () => {
  const navigate = useNavigate();

  const onButtonInCorrectHandle = e => {
    e.preventDefault();
    navigate(routesPaths.shareData);
  };

  const onButtonCorrectHandle = e => {
    e.preventDefault();
    navigate(routesPaths.takePhoto);
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

  const visitorInfo = App.useState(
    s => s.app.documentVisitorData?.OcrFields?.DocVisualExtendedInfo?.pArrayFields,
  );

  console.log(visitorInfo);

  return (
    <div className={s.documentFields}>
      <div className={s.wrapper}>
        <h2 className={`${s.title} commonTitle`}>Результат сканирования</h2>
        <div className={s.inputBox}>
          <Input
            title="Фамилия"
            name="last_name"
            value={visitorInfo?.[22]?.Buf_Text}
            onChange={onChangeHandle}
          />
          <Input
            title="Имя"
            name="first_name"
            value={visitorInfo?.[23]?.Buf_Text}
            onChange={onChangeHandle}
          />
          <Input
            title="Отчество"
            name="middle_name"
            value={visitorInfo?.[24]?.Buf_Text}
            onChange={onChangeHandle}
          />
          <Input
            title="Дата рождения"
            name="birthday"
            value={birthday}
            onChange={onChangeHandle}
          />
          <Input
            title="Серия и номер документа"
            name="number"
            value={visitorInfo?.[5]?.Buf_Text}
            onChange={onChangeHandle}
          />
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
