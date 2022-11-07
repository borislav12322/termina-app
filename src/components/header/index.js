import React from 'react';
import s from './header.module.css';
import Logo from '../../assets/images/mfua_logo.png'
import Time from '../time/index';

const Header = () => {
    return (
        <header className={s.header}>
            <div className={s.wrapper}>
                <img src={Logo} alt="логотип"/>
                <Time header/>
            </div>
        </header>
    );
};

export default Header;