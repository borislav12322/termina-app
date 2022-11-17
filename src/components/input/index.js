import React from 'react';

import s from './input.module.css';

const Input = ({ name, title, value, onChange, maxSymbols, type, onFocus }) => {
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
        type={type || 'text'}
        maxLength={15}
        onFocus={onFocus}
      />
    </label>
  );
};

export default Input;
