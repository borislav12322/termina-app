import React from 'react';
import s from './homeButton.module.css';
import HomeIcon from '../../assets/images/home-05.png'
import {useNavigate} from 'react-router-dom';

const HomeButton = () => {

    const navigate = useNavigate();

    const onClickHandle = (e) => {
        e.preventDefault();
        navigate('/');
    }

    return (
        <button type="button" className={s.button} onClick={onClickHandle}>
            <img src={HomeIcon} alt="домой"/>
        </button>
    );
};

export default HomeButton;