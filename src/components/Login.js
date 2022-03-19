import React, { useState } from "react";
import { Link } from "react-router-dom";
import InfoTooltip from "./InfoTooltip";
import * as auth from "../utils/auth";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const [isInfoTolltipOpen, setIsInfoTolltipPopup] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setMessage('');
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      return;
    }
    auth.signin(email, password).then((data) => {
      if(!data) {
        setMessage('Oops, something went wrong! Please try again.');
        setIsInfoTolltipPopup(true);
      }
      if(data.token) {
        resetForm();
        const userData = {
          email: email,
          token: data.token
        }
        props.onLogin(userData);
        return;
      }
    }).catch(err => console.log(err));
  }

  function onClose() {
    setIsInfoTolltipPopup(false);
  }

  return (
    <div className="login">
      <InfoTooltip
        isOpen={isInfoTolltipOpen}
        onClose={onClose}
        success={false}
        message={message}
      />
      <p className="login__header">Log in</p>
      <form onSubmit={handleSubmit} className="login__form">
        <input
          className="login__input"
          required
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login__input"
          required
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="login__button"
        >
          Log in
        </button>
      </form>
      <p className="login__signup">
        Not a member yet?{" "}
        <Link to="/signup" className="login__link">
          Sign up here!
        </Link>
      </p>
    </div>
  );
}

export default Login;
