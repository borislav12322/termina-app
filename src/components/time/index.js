import React, {useEffect, useState} from 'react';
import s from './time.module.css';

const Time = ({loginPage, header}) => {
    const [time, setTime] = useState(new Date());

    const getCurrentTime = () => {

        let hours = time.getHours();

        let minutes = time.getMinutes();

        if (hours < 10) {
            hours = `0${hours}`;
        }

        if (minutes < 10) {
            minutes = `0${minutes}`;
        }

        return `${hours}:${minutes}`
    }

    const getCurrentDate = () => {
        const yyyy = time.getFullYear();
        let month = time.getMonth() + 1;
        let day = time?.getDate();

        if (day < 10) {
            day = `0${day}`;
        }

        if (month < 10) {
            month = `0${month}`;
        }

        return `${day}.${month}.${yyyy}`
    }

    useEffect(() => {

        const setCurrentTimeDate = () => {
            return setInterval(() => setTime(new Date()),
                10000)
        }

        setCurrentTimeDate();


        return clearInterval(setCurrentTimeDate())
    }, [])

    return (
        <div className={s.time}>
            <div className={s.wrapper}>
                <span className={`${s.timeValue} ${header ? s.headerTime : s.loginTime}`}>{getCurrentTime()}</span>
                <span className={`${s.dateValue} ${header ? s.headerDate : s.loginDate}`}>{getCurrentDate()}</span>
            </div>

        </div>
    );
};

export default Time;