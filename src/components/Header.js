import { Link } from "react-router-dom";
import logo from "../images/logo/logo.svg";
import menu from "../images/icon/menu.svg";

function Header(props) {

  return (
    <header className="header">
      <div className="header__logo-container">
        <img className="header__logo" src={logo} alt="Around the U.S logo" />
        <img className="header__container-button" src={menu} alt="s" />
      </div>
      
      <div className="header__user-container">
        <p className="header__id">{props.email}</p>
        <Link to={props.link} className="header__link">{props.linkTitle}</Link>
        <button className={props.button}>Log out</button>
      </div>
    </header>
  );
}

export default Header;
