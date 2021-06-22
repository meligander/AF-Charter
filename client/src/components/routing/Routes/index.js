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
import VesselsList from "../../pages/VesselsList";
import EditVessel from "../../pages/EditVessel";
import ManageImages from "../../pages/ManageImages";
import ReservationsList from "../../pages/ReservationsList";
import AdminReservation from "../../pages/AdminReservation";
import NewReservation from "../../pages/NewReservation";

const Routes = () => {
   return (
      <section className="container">
         <div>
            <Alert type="1" />
            <Switch>
               <Route exact path="/vessels" component={Vessels} />
               <Route exact path="/vessel/:vessel_id" component={Vessel} />
               <Route exact path="/signup" component={AccountInfo} />
               <Route exact path="/profile" component={AccountInfo} />
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
                  types={["customer", "captain", "admin", "admin&captain"]}
                  component={ChangeReservation}
               />
               <PrivateRoutes
                  exact
                  path="/payment/:reservation_id"
                  types={["customer", "captain", "admin", "admin&captain"]}
                  component={ChangeReservation}
               />
               <PrivateRoutes
                  exact
                  path="/admin-reservation/:reservation_id"
                  types={["admin", "admin&captain"]}
                  component={AdminReservation}
               />
               <PrivateRoutes
                  exact
                  path="/vessels-list"
                  types={["admin", "admin&captain"]}
                  component={VesselsList}
               />
               <PrivateRoutes
                  exact
                  path="/reservations-list"
                  types={["admin", "admin&captain"]}
                  component={ReservationsList}
               />
               <PrivateRoutes
                  exact
                  path="/edit-vessel/:vessel_id"
                  types={["admin", "admin&captain"]}
                  component={EditVessel}
               />
               <PrivateRoutes
                  exact
                  path="/new-vessel"
                  types={["admin", "admin&captain"]}
                  component={EditVessel}
               />
               <PrivateRoutes
                  exact
                  path="/new-reservation"
                  types={["admin", "admin&captain"]}
                  component={NewReservation}
               />
               <PrivateRoutes
                  exact
                  path={`/images/:vessel_id`}
                  types={["admin", "admin&captain"]}
                  component={ManageImages}
               />
            </Switch>
         </div>
      </section>
   );
};

export default Routes;
