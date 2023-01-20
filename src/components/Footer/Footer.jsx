<<<<<<< HEAD
import React from "react";
import "./Footer.css";
import { Divider } from "@mantine/core";
import { Socials } from "../../components";

const Footer = () => {
     return (
          <footer>
               <Divider />
               <div className="footer__container">
                    <div className="footer__info">
                         <p> Copyright &#169; {new Date().getFullYear()} | Laurier Computing Society. All rights reserved.</p>
                         <div className="footer__socials"> 
                              <Socials />
                         </div>
                         <p> Made with ❤️ from the LCS Development Team</p>
                    </div>
               </div>
          </footer>
     );
=======
import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <>
        </>
    );
>>>>>>> aa68f189a86f7c6231cd1f94aa73fd3f08aa7321
};

export default Footer;