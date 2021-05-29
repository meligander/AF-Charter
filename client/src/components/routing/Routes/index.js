import React from "react";
import { Switch, Route } from "react-router-dom";

import PrivateRoutes from "../PrivateRoutes";

import Vessels from "../../pages/Vessels";
import Vessel from "../../pages/Vessel";
import AccountInfo from "../../pages/AccountInfo";
import Activation from "../../pages/Activation";
import Alert from "../../shared/Alert";
import ChangePassword from "../../pages/ChangePassword";
import MyReservations from "../../pages/MyReservations";
import ChangeReservation from "../../pages/ChangeReservation";

const Routes = () => {
   return (
      <section className="container">
         <div>
            <Alert type="1" />
            <Switch>
               <Route exact path="/vessels" component={Vessels} />
               <Route exact path="/vessel/:vessel_id" component={Vessel} />
               <Route exact path="/signup" component={AccountInfo} />
               <Route exact path="/activation/:token" component={Activation} />
               <Route
                  exact
                  path="/resetpassword/:token"
                  component={ChangePassword}
               />
               <PrivateRoutes
                  exact
                  path="/myreservations"
                  types={["customer"]}
                  component={MyReservations}
               />
               <PrivateRoutes
                  exact
                  path="/reservation/:reservation_id"
                  types={["customer", "captain"]}
                  component={ChangeReservation}
               />
               <PrivateRoutes
                  exact
                  path="/payment/:reservation_id"
                  types={["customer", "captain"]}
                  component={ChangeReservation}
               />
            </Switch>
         </div>
      </section>
   );
};

export default Routes;
