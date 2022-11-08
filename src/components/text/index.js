import React from 'react';

import s from './text.module.css';

const Text = ({ text, maxWidth }) => {
  return <p className={s.text}>{text}</p>;
};

export default Text;
