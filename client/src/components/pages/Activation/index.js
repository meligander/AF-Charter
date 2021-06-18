import React, { useEffect } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { activation } from "../../../actions/auth";

const Activation = ({
   match,
   auth: { loading, loggedUser, error },
   activation,
}) => {
   const token = match.params.token;

   useEffect(() => {
      activation(token);
   }, [token, activation]);

   return (
      !loading && (
         <div>
            {error !== "" ? (
               <>
                  <h2 className="heading heading-primary">
                     Ups... something went wrong!
                  </h2>
                  <p className="heading-tertiary m-3 py-3 text-danger">
                     {error.msg}
                  </p>
               </>
            ) : (
               loggedUser !== null && (
                  <>
                     <h2 className="heading heading-primary text-primary">
                        Welcome {loggedUser.name + " " + loggedUser.lastname}!
                     </h2>
                     <p className="heading-tertiary m-3 py-3">
                        Welcome to Charter AF! You can start using our services
                        now.
                     </p>
                  </>
               )
            )}
         </div>
      )
   );
};

Activation.propTypes = {
   auth: PropTypes.object.isRequired,
   activation: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   auth: state.auth,
});

export default connect(mapStateToProps, { activation })(Activation);
