import api from "../utils/api";
import history from "../utils/history";

import { PAYMENT_REGISTERED, PAYMENT_ERROR } from "./types";

import { setAlert } from "./alert";
import { updateLoadingSpinner } from "./mixvalues";

export const makeAPayment = (formData, payment_id) => async (dispatch) => {
   dispatch(updateLoadingSpinner(true));
   try {
      const res = await api.put(`/payment/${payment_id}`, formData);
      dispatch({
         type: PAYMENT_REGISTERED,
         payload: res.data,
      });

      history.push("/myreservations");
   } catch (err) {
      dispatch(setAlert(err.response.data.msg, "danger", "3"));
      dispatch({
         type: PAYMENT_ERROR,
         payload: {
            type: err.response.statusText,
            status: err.response.status,
            msg: err.response.data.msg,
         },
      });
      window.scrollTo(0, 0);
   }

   dispatch(updateLoadingSpinner(false));
};
