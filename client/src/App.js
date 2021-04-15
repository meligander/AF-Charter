import React, { Fragment, useEffect } from "react";
import { Switch, Route } from "react-router-dom";

//Redux
import store from "./store";
import { Provider } from "react-redux";
import setAuthToken from "./utils/setAuthToken";

//actions
import { loadUser } from "./actions/auth";

import Navbar from "./components/layout/Navbar";
import Main from "./components/pages/Main";

import "./style/main.scss";

const App = () => {
   useEffect(() => {
      if (localStorage.token) {
         setAuthToken(localStorage.token);
         store.dispatch(loadUser());
      }
   }, []);
   return (
      <Provider store={store}>
         <Fragment>
            <Navbar />
            <Switch>
               <Route exact path="/" component={Main} />
            </Switch>
         </Fragment>
      </Provider>
   );
};

export default App;
