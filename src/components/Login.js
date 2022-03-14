import React from 'react';
import { Link } from 'react-router-dom';
import * as auth from '../utils/auth.js';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.email || !this.state.password) {
      return;
    }
    auth.signin(this.state.email, this.state.password)
      .then((data) => {
        if (data.jwt) {
          this.setState({ email: '', password: '' }, () => {
            this.props.handleLogin(data.user);
            this.props.history.push('/');
          })
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="login">
        <p className="login__header">Log in</p>
        <form onSubmit={this.handleSubmit} className="login__form">
          <input className="login__input" required id="email" name="email" type="email" placeholder='Email' value={this.state.email} onChange={this.handleChange} />
          <input className="login__input" required id="password" name="password" type="password" placeholder='Password' value={this.state.password} onChange={this.handleChange} />
          <button type="submit" onSubmit={this.handleSubmit} className="login__button">Log in</button>
        </form>
        <p className="login__signup">Not a member yet? <Link to="/signup" className="login__link">Sign up here!</Link></p>
      </div>
    )
  }
}

export default Login;
