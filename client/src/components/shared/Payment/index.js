import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import Form from "./Form";
import "./style.scss";

const Payment = ({ type }) => {
   const stripeTestPromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

   return (
      <div className="payment">
         <Elements stripe={stripeTestPromise}>
            <Form type={type} />
         </Elements>
      </div>
   );
};

export default Payment;
