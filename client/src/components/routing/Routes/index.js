import React from "react";
import { Switch, Route } from "react-router-dom";

import PrivateRoutes from "../PrivateRoutes";

import Vessels from "../../pages/Vessels";
import Vessel from "../../pages/Vessel";
import EditUser from "../../pages/EditUser";
import Activation from "../../pages/Activation";
import Alert from "../../shared/Alert";
import ChangePassword from "../../pages/ChangePassword";
import MyReservations from "../../pages/MyReservations";
import EditReservation from "../../pages/EditReservation";
import VesselsList from "../../pages/VesselsList";
import EditVessel from "../../pages/EditVessel";
import ManageImages from "../../pages/ManageImages";
import ReservationsList from "../../pages/ReservationsList";
import AdminReservation from "../../pages/AdminReservation";
import NewReservation from "../../pages/NewReservation";
import MaintenanceList from "../../pages/MaintenanceList";
import EditMaintenance from "../../pages/EditMaintenance";
import UsersList from "../../pages/UsersList";

const Routes = () => {
   return (
      <section className="container">
         <div>
            <Alert type="1" />
            <Switch>
               <Route exact path="/vessels" component={Vessels} />
               <Route exact path="/vessel/:vessel_id" component={Vessel} />
               <Route exact path="/signup" component={EditUser} />
               <Route exact path="/profile" component={EditUser} />
               <Route exact path="/activation/:token" component={Activation} />
               <Route
                  exact
                  path="/resetpassword/:token"
                  component={ChangePassword}
               />
               <PrivateRoutes
                  exact
                  path="/new-user"
                  component={EditUser}
                  types={["admin", "admin&captain"]}
               />
               <PrivateRoutes
                  exact
                  path="/edit-user/:user_id"
                  component={EditUser}
                  types={["admin", "admin&captain"]}
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
                  component={EditReservation}
               />
               <PrivateRoutes
                  exact
                  path="/payment/:reservation_id"
                  types={["customer", "captain", "admin", "admin&captain"]}
                  component={EditReservation}
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
                  path="/maintenance-list"
                  types={["admin", "admin&captain"]}
                  component={MaintenanceList}
               />
               <PrivateRoutes
                  exact
                  path="/users-list"
                  types={["admin", "admin&captain"]}
                  component={UsersList}
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
                  path="/new-maintenance"
                  types={["admin", "admin&captain"]}
                  component={EditMaintenance}
               />
               <PrivateRoutes
                  exact
                  path="/edit-maintenance/:maintenance_id"
                  types={["admin", "admin&captain"]}
                  component={EditMaintenance}
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
