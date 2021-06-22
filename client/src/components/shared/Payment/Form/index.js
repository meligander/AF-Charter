import React, { useState } from "react";
import { connect } from "react-redux";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { MdAttachMoney } from "react-icons/md";
import PropTypes from "prop-types";

import { makeStripePayment } from "../../../../actions/payment";
import { updateReservation } from "../../../../actions/reservation";
import { updateLoadingSpinner } from "../../../../actions/mixvalues";
import { setAlert } from "../../../../actions/alert";

import PopUp from "../../../modal/PopUp";

const CARD_OPTIONS = {
   iconStyle: "solid",
   style: {
      base: {
         iconColor: "#15767c",
         color: "#15767c",
         fontWeight: 500,
         fontSize: "16px",
         fontFamily: "Montserrat, sans-serif",
         fontSmoothing: "antialiased",
         ":-webkit-autofill": { color: "#15767c" },
         "::placeholder": { color: "#7ea1a3" },
      },
      invalid: {
         iconColor: "#c9444d",
         color: "#c9444d",
      },
   },
};

const Form = ({
   reservations: { reservation },
   auth: { loggedUser },
   makeStripePayment,
   updateLoadingSpinner,
   updateReservation,
   setAlert,
   type,
}) => {
   const stripe = useStripe();
   const elements = useElements();

   const amount =
      type === "downpayment"
         ? reservation.downpayment.amount
         : reservation.balance.amount;

   const [adminValues, setAdminValues] = useState({
      modalConfirm: false,
   });

   const { modalConfirm } = adminValues;

   const handleSubmit = async () => {
      updateLoadingSpinner(true);
      const { error, paymentMethod } = await stripe.createPaymentMethod({
         type: "card",
         card: elements.getElement(CardElement),
      });

      if (!error) {
         const { id } = paymentMethod;

         makeStripePayment(
            {
               amount,
               id,
            },
            reservation[type]._id,
            loggedUser.type,
            type
         );
         updateReservation({ active: false }, reservation._id);
      } else {
         console.error(error);
         setAlert(error.message, "danger", "3");
      }
   };

   const toggleModal = (e) => {
      if (e) e.preventDefault();
      setAdminValues((prev) => ({
         ...prev,
         modalConfirm: !modalConfirm,
      }));
   };

   return (
      <form onSubmit={toggleModal}>
         <PopUp
            type="confirmation"
            confirm={handleSubmit}
            setToggleModal={toggleModal}
            toggleModal={modalConfirm}
            text={`Are you sure you want to make the ${type} payment${
               type === "balance" && reservation.balance.status !== "success"
                  ? " and complete the reservation"
                  : ""
            }?`}
            subtext={
               reservation[type].status === "success"
                  ? "If you change the payment method, the previous one will be canceled"
                  : undefined
            }
         />
         <fieldset className="payment-form-group">
            <div className="payment-form-row">
               <CardElement options={CARD_OPTIONS} />
            </div>
         </fieldset>
         <div className="btn-center">
            <button className="btn btn-success" type="submit">
               Pay <MdAttachMoney className="icon" />
            </button>
         </div>
      </form>
   );
};

Form.propTypes = {
   reservations: PropTypes.object.isRequired,
   auth: PropTypes.object.isRequired,
   makeStripePayment: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
   updateLoadingSpinner: PropTypes.func.isRequired,
   updateReservation: PropTypes.func.isRequired,
   type: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
   reservations: state.reservations,
   auth: state.auth,
});

export default connect(mapStateToProps, {
   setAlert,
   makeStripePayment,
   updateLoadingSpinner,
   updateReservation,
})(Form);
