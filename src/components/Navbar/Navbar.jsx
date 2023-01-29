import React from 'react';
import './Navbar.css';
import { IconLogo } from '@assets';
import { NavbarSocials } from '@components';
import { Link } from 'react-scroll';

const Navbar = () => {
    return (
        <div className="navbar">
            <img className="navbar__logo" src={IconLogo} alt="logo" />

            <ul className="navbar__links">
                {['About', 'Events', 'Initiatives', 'FAQ', 'Team'].map(
                    (item) => (
                        <li key={`link-${item}`}>
                            <Link to={`${item}`} smooth duration={300}>{item}</Link>
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
