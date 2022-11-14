import React from 'react';

import s from './input.module.css';

const Input = ({ name, title, value, onChange }) => {
  return (
    <label htmlFor={name} className={s.label}>
      <span className={s.title}>{title}</span>
      <span className={s.bg} />
      <input
        className={s.input}
        value={value}
        onChange={onChange}
        placeholder={title}
        id={name}
        name={name}
        type="text"
        autoFocus={false}
      />
    </label>
  );
};

export default Input;
