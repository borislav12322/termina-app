import React from 'react';

import s from './textField.module.css';

const TextField = ({ text, title }) => {
  return (
    <div className={s.textField}>
      <span className={s.title}>{title}</span>
      <span className={s.text}>{text}</span>
    </div>
  );
};

export default TextField;
