import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Loading from "../../modal/Loading";

const PrivateRoutes = ({
   component: Component,
   auth: { loggedUser, loading, token },
   types,
   path,
}) => {
   if (!loading && token) {
      let pass = false;
      if (types.length === 0) {
         pass = true;
      } else {
         for (let x = 0; x < types.length; x++) {
            if (types[x] === loggedUser.type) {
               pass = true;
               break;
            }
         }
      }

      if (pass) {
         return <Route exact path={path} component={Component} />;
      } else {
         return <Redirect to="/" />;
      }
   } else {
      if (token === null) {
         return <Redirect to="/login" />;
      } else {
         return <Loading />;
      }
   }
};

PrivateRoutes.propTypes = {
   auth: PropTypes.object.isRequired,
   types: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoutes);
