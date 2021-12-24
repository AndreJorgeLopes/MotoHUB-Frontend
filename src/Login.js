import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { useHistory } from "react-router-dom";

import Logo from "./assets/logo-text.png";
import api from "./services/api";
import { login, logout } from "./services/auth";

import './Login.css';

function Login() {
    const history = useHistory();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async e => {
      e.preventDefault();
      if (!email || !password) {
        setError("Fill in your e-mail address and password to continue!");
      } else {
          try {
              const response = await api.post("login", { email, password });
              logout();
              login(response.data.token, response.data.user.id);
              history.push("/");
              window.location.href='/';
        } catch (err) {
            setError("");
            setTimeout(() => {
                setError("There was a problem, please check your credentials.");
           }, 500);
        }
      }
    };
  
    return (
      <div className='login'>
        <form onSubmit={handleLogin}>
          <img src={Logo} alt="logo" />
          {error && <p>{error}</p>}
          <input
            type="email"
            placeholder="Email"
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit">Sign In</button>
          <hr />
          <Link to="/register" style={{paddingBottom : 0}}>Create a free account</Link>
        </form>
      </div>
    );
    
}

export default withRouter(Login);
