import React from "react";
import "./Footer.css";
import { Divider } from "@mantine/core";
import { Socials } from "../../components";

const Footer = () => {
     return (
          <footer>
               <div className="spacer" style={{ width: "100%", height: "1.5em" }} />
               <Divider />
               <div className="spacer" style={{ width: "100%", height: "1.5em" }} />
               <div className="footer__container">
                    <div className="footer__info">
                         <p> Copyright &#169; {new Date().getFullYear()} | Laurier Computing Society. All rights reserved.</p>
                         <div className="footer__socials"> 
                              <Socials />
                         </div>
                         <p> Made with ❤️ from the LCS Development Team</p>
                    </div>
               </div>
               <div className="spacer" style={{ width: "100%", height: "1.5em" }} />
          </footer>
     );
};

export default Footer;