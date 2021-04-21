import React from "react";

import "./style.scss";

const Footer = () => {
   return (
      <footer className="footer bg-primary">
         <p>AF Charter Copyright &copy; {new Date().getFullYear()}</p>
      </footer>
   );
};

export default Footer;
