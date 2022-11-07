import React from 'react';
import s from './button.module.css';

const Button = ({text, type, paddingLeftRight, onClick}) => {
    return (
        <button className={s.button}
                onClick={onClick}
                type={type}
                style={{paddingLeft: paddingLeftRight, paddingRight: paddingLeftRight}}
        >
            {text}
        </button>
    );
};

export default Button;