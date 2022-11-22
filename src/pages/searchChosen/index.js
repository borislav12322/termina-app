import React from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../components/button';
import { routesPaths } from '../../constans/routesPathes';

import s from './searchChosen.module.css';

const SearchChosen = () => {
  const navigate = useNavigate();

  const phoneButtonHandle = e => {
    e.preventDefault();
    navigate(routesPaths.phoneNumber);
  };

  const faceButtonHandle = e => {
    e.preventDefault();
    navigate(routesPaths.foundFace);
  };

  return (
    <div className={s.searchChosen}>
      <div className={s.wrapper}>
        <h2 className={`${s.title} commonTitle`}>Поиск пропуска</h2>
        <div className={s.buttonsBox}>
          <Button text="По номеру телефона" onClick={phoneButtonHandle} />
          <Button text="По лицу" onClick={faceButtonHandle} />
        </div>
      </div>
    </div>
  );
};

export default SearchChosen;
