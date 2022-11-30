import React from 'react';

import ReactInputMask from 'react-input-mask';

import s from './inputWithMask.module.css';

const InputWithMask = ({
  mask,
  onChange,
  placeholder,
  value,
  name,
  inputType,
  title,
}) => {
  return (
    <label htmlFor={name} className={s.label}>
      <span className={s.title}>{title}</span>
      <span className={s.bg} />
      <ReactInputMask
        className={s.input}
        mask={mask}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
        name={name}
        type={inputType || 'text'}
      />
    </label>
  );
};

export default InputWithMask;
