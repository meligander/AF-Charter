import { LOADINGSPINNER_UPDATED } from "./types";

export const updateLoadingSpinner = (bool) => (dispatch) => {
   dispatch({
      type: LOADINGSPINNER_UPDATED,
      payload: bool,
   });
};

export const formatNumber = (number) => {
   return Number(number)
      .toFixed(2)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
