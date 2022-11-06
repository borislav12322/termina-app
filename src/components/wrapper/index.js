import React from 'react';
import s from './wrapper.module.css';
import {Outlet} from "react-router-dom";
import Header from "../header";
import Footer from "../footer";

const Wrapper = () => {
    return (
        <div className={s.wrapper}>
            <Header/>
            <Outlet/>
            <Footer/>
        </div>
    );
};

export default Wrapper;