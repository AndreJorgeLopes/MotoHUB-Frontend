import React from "react";

import Logo from "./assets/logo.png";

import './NotFound.css';

function NotFound() {
    return (
      <div className='NotFound'>
        <form>
          <img src={Logo} alt="logo" />
          <p>Page not found.</p>
        </form>
      </div>
    );
    
}

export default NotFound;
