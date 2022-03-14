import { Link } from "react-router-dom";
import logo from "../images/logo/logo.svg";

function Header(props) {

  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Around the U.S logo" />
      <div className="header__user-container">
        <p className="header__id">{props.email}</p>
        <Link to={props.link} className="header__link">{props.linkTitle}</Link>
      </div>
    </header>
  );
}

export default Header;
