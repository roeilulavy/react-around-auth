import { Link } from "react-router-dom";
import logo from "../images/logo/logo.svg";

function Header(props) {
  return (
    <header className="header">
      <img className="header__logo" src={logo} alt="Around the U.S logo" />
      <div className="header__user-container">
        <p className="header__id">.</p>
        <Link to={props} className="header__link">L</Link>
      </div>
    </header>      
  );
}

export default Header;
