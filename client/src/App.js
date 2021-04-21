import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Switch, Route } from "react-router-dom";

//Redux
import store from "./store";
import { Provider } from "react-redux";
import setAuthToken from "./utils/setAuthToken";

//actions
import { loadUser } from "./actions/auth";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

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
         <Router>
            <Fragment>
               <Navbar />
               <Switch>
                  <Route exact path="/" component={Main} />
               </Switch>
               <Footer />
            </Fragment>
         </Router>
      </Provider>
   );
};

export default App;
