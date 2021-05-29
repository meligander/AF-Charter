import React from "react";
import { connect } from "react-redux";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { MdAttachMoney } from "react-icons/md";
import PropTypes from "prop-types";

import { makeAPayment } from "../../../../actions/payment";
import { setAlert } from "../../../../actions/alert";

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

const Form = ({ reservations: { reservation }, makeAPayment, setAlert }) => {
   const stripe = useStripe();
   const elements = useElements();

   const handleSubmit = async (e) => {
      e.preventDefault();

      const { error, paymentMethod } = await stripe.createPaymentMethod({
         type: "card",
         card: elements.getElement(CardElement),
      });

      if (!error) {
         const { id } = paymentMethod;

         makeAPayment(
            {
               amount: reservation.payment.downpayment.amount * 100,
               id,
            },
            reservation.payment._id
         );
      } else {
         console.error(error);
         setAlert(error.message, "danger", "3");
      }
   };

   return (
      <form onSubmit={handleSubmit}>
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
   makeAPayment: PropTypes.func.isRequired,
   setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
   reservations: state.reservations,
});

export default connect(mapStateToProps, { setAlert, makeAPayment })(Form);
