import React from 'react';
import { Link } from 'react-router-dom';
import * as auth from '../utils/auth.js';

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    auth.signup(email, password).then((res) => {
      if (res) {
        console.log(res);
        this.props.history.push('/signin');
      } else {
        console.error('Something went wrong.');
      }
    });
  }

  render() {
    return (
      <div className="register">
        <p className="register__header">
          Sign up
        </p>
        <form onSubmit={this.handleSubmit} className="register__form">
          <input className="register__input" required id="email" name="email" type="email" placeholder='Email' value={this.state.email} onChange={this.handleChange} />
          <input className="register__input" required id="password" name="password" type="password" placeholder='Password' value={this.state.password} onChange={this.handleChange} />
          <button type="submit" onSubmit={this.handleSubmit} className="register__button">Sign up</button>
        </form>
        <p className="register__signin">Already a member? <Link to="signin" className="register__link">Log in here!</Link></p>
      </div>
    );
  }
}

export default Register;
