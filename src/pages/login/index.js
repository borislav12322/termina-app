import React from 'react';
import Button from "../../components/button";
import s from './login.module.css';
import {routesPaths} from "../../constans/routesPathes";
import {useNavigate} from 'react-router-dom';
import Time from "../../components/time";

const Login = () => {
    const navigate = useNavigate();

    const onButtonClickHandle = (e) => {
        e.preventDefault();
        navigate(routesPaths.shareData)
    }

    return (
        <div className={s.login}>
            <div className={s.wrapper}>
                <div></div>

                <div className={s.time}>
                    <Time loginPage/>
                </div>

                <Button text="Получить пропуск" type="button" paddingLeftRight="80px" onClick={onButtonClickHandle}/>

            </div>
        </div>
    );
};

export default Login;