import React, { useState } from "react";
import { Link } from "react-router-dom";
import InfoTooltip from "./InfoTooltip";
import * as auth from "../utils/auth";

const Register = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const [isInfoTolltipOpen, setIsInfoTolltipPopup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    auth.signup(email, password).then((res) => {
      if (res) {
        setMessage('Success! You have now been registered.');
        setSuccess(true);
      }
    }).catch((err) => {
      setMessage(err.message);
      setSuccess(false);
    })
    setIsInfoTolltipPopup(true)
  };

  function onClose() {
    setIsInfoTolltipPopup(false);
    if(success === true) {
      props.onRegister();
    }
  }

  return (
    <div className="register">
      <InfoTooltip
        isOpen={isInfoTolltipOpen}
        onClose={onClose}
        success={success}
        message={message}
      />
      <p className="register__header">Sign up</p>
      <form onSubmit={handleSubmit} className="register__form">
        <input
          className="register__input"
          required
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="register__input"
          required
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="register__button">
          Sign up
        </button>
      </form>
      <p className="register__signin">
        Already a member?{" "}
        <Link to="signin" className="register__link">
          Log in here!
        </Link>
      </p>
    </div>
  );
};

export default Register;
