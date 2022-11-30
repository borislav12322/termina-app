import React from 'react';

import { App } from '../../store';

import s from './error.module.css';

const Error = () => {
  const errorText = App.useState(s => s.app.error);

  return <div className={s.error}>{errorText}</div>;
};

export default Error;
