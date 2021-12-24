import React, { useState, useEffect } from 'react'
import './Header.css'
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Avatar } from "@material-ui/core";
import logo from './assets/logo_ext.png';
import { logout } from './services/auth';
import { getUser, isAuthenticated } from "./services/auth";
import api from "./services/api";

function Header() { /* eslint-disable  */
    const [dropdownContent, setDropdownContent] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [avatar, setavatar] = useState(<Avatar />);
    const [load, setLoad] = useState();
    
    useEffect(() => {
        async function run () {
            const logged = isAuthenticated();
            let user = null;

            if(logged){
                await api.get(`account/${getUser()}`).then(async res => {
                    user = res.data;
                    if (user.avatar) setavatar(<img src={`${process.env.REACT_APP_API_URL || (window.location.href.slice(0, -1) + ':8000')}/files/${user.avatar}`}/>)
                });
            }
    
            setDropdownContent (
                <div className="dropdown-content">
                    <a href={logged ? '' : "login"}>{logged ? `Hello, ${user.first_name}` : "Login"}</a>
                    <a onClick={logged ? () => logout() : () => {}} href={logged ? '/' : "register"}>{logged ? 'Sign Out' : "Register"}</a>
                </div>
            )
        }
        setTimeout(() => {
            run();
        }, 500);
    }, [showDropdown]);

    return (
        <div className='header'>
            <a href='/sell' className="header__left">Sell Now</a>
           
            <div className='header__center header_item'>
            <a href='/'>
                <img 
                    className="header__icon header_item" 
                    src= {logo}
                    alt=""
                />
            </a>
            </div>

            <div className='header__right header_item'>
                <div>
                    <div className='user' onClick={() => setShowDropdown(!showDropdown)}>
                        <ExpandMoreIcon />
                        {avatar}
                    </div>
                    {showDropdown && dropdownContent}
                </div>
            </div>
        </div>
    )
}

export default Header
