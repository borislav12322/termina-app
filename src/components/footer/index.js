import React from 'react';
import s from './footer.module.css';
import HomeButton from "../homeButton";

const Footer = () => {
    return (
        <footer className={s.footer}>
            <div className={s.wrapper}>
                <HomeButton/>
            </div>
        </footer>
    );
};

export default Footer;