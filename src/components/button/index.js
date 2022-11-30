import React from 'react';

import s from './button.module.css';

const Button = ({ text, type, paddingLeftRight, onClick, id, buttonWhite }) => {
  return (
    <button
      id={id}
      className={`${s.button} ${buttonWhite && s.buttonWhite}`}
      onClick={onClick}
      type={type}
      style={{ paddingLeft: paddingLeftRight, paddingRight: paddingLeftRight }}
    >
      {text}
    </button>
  );
};

export default Button;
