import React from 'react';
import './Navbar.css';
import { BsLinkedin, BsGithub } from 'react-icons/bs';
import logo from '../../assets/logo_icon.svg';
import { NavbarSocials } from '@components';

const Navbar = () => {
    return (
        <div className="navbar">
            <img className="navbar__logo" src={logo} alt="logo" />

            <ul className="navbar__links">
                {['FAQ', 'Events', 'About', 'The team', 'Contact'].map(
                    (item) => (
                        <li key={`link-${item}`}>
                            <div />
                            <a href={`#${item}`}>{item}</a>
                        </li>
                    )
                )}
            </ul>
            <div className="navbar__socials">
                <NavbarSocials />
            </div>
        </div>
    );
};

export default Navbar;
