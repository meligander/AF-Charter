import React from "react";
import { Switch, Route } from "react-router-dom";

import Vessels from "../../pages/Vessels";
import Vessel from "../../pages/Vessel";

const Routes = () => {
   return (
      <section className="container">
         <Switch>
            <Route exact path="/vessels" component={Vessels} />
            <Route exact path="/vessel/:vessel_id" component={Vessel} />
         </Switch>
      </section>
   );
};

export default Routes;
