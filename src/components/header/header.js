import React from "react";
import { Link } from 'react-router-dom';
import Logo from './logo.png'
import './header.css';

const Header = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <img className="navbar-logo" src={Logo} alt="pokedexID"/>
            </Link>
        </nav>
    )
}

export default Header;