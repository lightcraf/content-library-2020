﻿import React, {useState} from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import logo from "../assets/logo.png";


function Header() {
    const [showNav, setToggleNav] = useState(false);

    const toggleNav = () => {
        setToggleNav((prevShowNav) => !prevShowNav);
    }

    return (
        <header className="header">
            <nav className="top-nav">
                <h1 className="logo">
                    <Link to="/"><img src={logo} className="logo__img" alt="site logo" /></Link>
                </h1>
                <div className="toggle-nav" onClick={toggleNav}>
                    <span>Toggle navigation</span>
                </div>
                <ul className={showNav ? "top-nav__list active" : "top-nav__list"}>
                    <li className="top-nav__item"><a href="/" className="top-nav__link">Home</a></li>
                    <li className="top-nav__item dropdown">
                        <a href="/" className="top-nav__link caret-nav" aria-haspopup="true">Movies</a>
                        <div className="dropdown__box" aria-label="submenu">
                            <a href="/" className="dropdown__link">Avangers</a>
                            <a href="/" className="dropdown__link">Green Mile</a>
                            <a href="/" className="dropdown__link">Destination</a>
                            <a href="/" className="dropdown__link">John Wick</a>
                        </div>
                    </li>
                    <li className="top-nav__item">
                        <Link to="/content" className="top-nav__link">Content</Link>
                    </li>
                    <li className="top-nav__item">
                        <a href="/" className="top-nav__link">Forum</a>
                    </li>
                    <li className="top-nav__item">
                        <Link to="/signin" className="top-nav__link">Sign In</Link>
                    </li>
                    <li className="top-nav__item">
                        <Link to="/signup" className="top-nav__link">Sign Up</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;