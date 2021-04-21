import React, { Fragment } from "react";

import Header from "../../layout/Header";
import Fleet from "./Fleet";
import Features from "./Features";
import ContactUs from "./ContactUs";

const Main = () => {
   return (
      <Fragment>
         <Header />
         <Fleet />
         <Features />
         <ContactUs />
      </Fragment>
   );
};

export default Main;
