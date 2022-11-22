import React from 'react';

import { useNavigate } from 'react-router-dom';

import Button from '../../components/button';
import Modal from '../../components/modal';
import { routesPaths } from '../../constans/routesPathes';
import { App } from '../../store';

import s from './shareData.module.css';

const ShareData = () => {
  const navigate = useNavigate();

  const buttonHandle = e => {
    e.preventDefault();
    navigate(routesPaths.searchChosen);
  };

  const pdAgrementButtonHandle = e => {
    e.preventDefault();
    App.update(s => {
      s.app.isModalVisible = true;
    });
  };

  return (
    <div className={s.shareData}>
      <Modal>
        <div className={s.modalContent}>
          <h2 className={s.modalTitle}>Согласие на обработку персональных данных</h2>
          <p className={s.modalText}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Architecto corporis
            error est necessitatibus! Doloribus eius esse in necessitatibus nesciunt
            officiis, perferendis quae qui quisquam rerum sapiente sunt tempore ut
            voluptatem?
          </p>
          <Button
            text="Закрыть"
            type="button"
            paddingLeftRight="14px"
            id="closeBtn"
            onClick={() => {
              App.update(s => {
                s.app.isModalVisible = false;
              });
            }}
          />
        </div>
      </Modal>
      <div className={s.wrapper}>
        <p className={s.text}>
          Нажимая <span className={s.redText}>«Далее»</span> , <br /> Вы даете{' '}
          <span className={s.button} type="button" onClick={pdAgrementButtonHandle}>
            согласие
          </span>{' '}
          на обработку Ваших персональных данных
        </p>
      </div>
      <Button
        text="Далее"
        type="button"
        paddingLeftRight="36px"
        onClick={buttonHandle}
        id="button_next"
      />
    </div>
  );
};

export default ShareData;
