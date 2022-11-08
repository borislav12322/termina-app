import React from 'react';

import s from './button.module.css';

const Button = ({ text, type, paddingLeftRight, onClick, id }) => {
  return (
    <button
      id={id}
      className={s.button}
      onClick={onClick}
      type={type}
      style={{ paddingLeft: paddingLeftRight, paddingRight: paddingLeftRight }}
    >
      {text}
    </button>
  );
};

export default Button;
