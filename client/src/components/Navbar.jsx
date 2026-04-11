import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useAuth } from "../store/auth";
import { FaBars, FaTimes } from "react-icons/fa";

export const Navbar = () => {

  const { isLoggedIn } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleToggle = () => {
    setShowMenu(!showMenu);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  return (
    <>
      <header>
        <div className="container head-container">
          <div className="logo-brand">
            <NavLink to="/">HardyTechnical</NavLink>
          </div>

          <nav className={showMenu ? "mobile-menu" : "web-menu"}>
            <ul>
              <li>
                <NavLink to="/" onClick={closeMenu}> Home </NavLink>
              </li>
              <li>
                <NavLink to="/about" onClick={closeMenu}> About </NavLink>
              </li>
              <li>
                <NavLink to="/service" onClick={closeMenu}> Services </NavLink>
              </li>
              <li>
                <NavLink to="/contact" onClick={closeMenu}> Contact </NavLink>
              </li>

              {isLoggedIn ? (
                <>
                  <li>
                    <NavLink to="/profile" onClick={closeMenu}>Profile</NavLink>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <NavLink to="/register" onClick={closeMenu}> Register </NavLink>
                  </li>
                  <li>
                    <NavLink to="/login" onClick={closeMenu}> Login </NavLink>
                  </li>
                </>
              )}
            </ul>
          </nav>

          <div className="hamburger-menu" onClick={handleToggle}>
            {showMenu ? <FaTimes /> : <FaBars />}
          </div>
        </div>
      </header>
    </>
  );
};

