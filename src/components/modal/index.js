import React, { useEffect, useState } from 'react';

import { createPortal } from 'react-dom';

import { App } from '../../store';
import Button from '../button';

import s from './modal.module.css';

const Modal = ({ children }) => {
  const isModalVisible = App.useState(s => s.app.isModalVisible);

  useEffect(() => {
    if (isModalVisible) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = 'visible';
    };
  }, [isModalVisible]);

  const renderPortal = () => {
    return (
      <div
        className={s.modal}
        onClick={() => {
          App.update(s => {
            s.app.isModalVisible = false;
          });
        }}
      >
        <div
          className={s.content}
          onClick={e => {
            e.stopPropagation();
          }}
        >
          {children}
        </div>
      </div>
    );
  };

  return <>{isModalVisible ? createPortal(renderPortal(), document.body) : null}</>;
};

export default Modal;
