import React from "react";
import { Switch, Route } from "react-router-dom";

import Vessels from "../../pages/Vessels";
import Vessel from "../../pages/Vessel";
import AccountInfo from "../../pages/AccountInfo";
import Activation from "../../pages/Activation";

const Routes = () => {
   return (
      <section className="container">
         <Switch>
            <Route exact path="/vessels" component={Vessels} />
            <Route exact path="/vessel/:vessel_id" component={Vessel} />
            <Route exact path="/signup" component={AccountInfo} />
            <Route exact path="/activation/:token" component={Activation} />
         </Switch>
      </section>
   );
};

export default Routes;
