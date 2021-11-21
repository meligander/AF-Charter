import React, { Fragment, useEffect } from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";

//Redux
import store from "./store";
import { Provider } from "react-redux";
import setAuthToken from "./utils/setAuthToken";
import history from "./utils/history";

//actions
import { loadUser } from "./actions/auth";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Routes from "./components/routing/Routes";
import PrivateRoutes from "./components/routing/PrivateRoutes";

import Main from "./components/pages/Main";
import Login from "./components/pages/Login";
import Contact from "./components/pages/Contact";
import Dashboard from "./components/pages/Dashboard";

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
         <Router history={history}>
            <Fragment>
               <Navbar />
               <Switch>
                  <Route exact path="/" component={Main} />
                  <Route exact path="/contact" component={Contact} />
                  <Route exact path="/login" component={Login} />
                  <PrivateRoutes
                     exact
                     path="/dashboard"
                     types={["captain", "admin", "admin&captain"]}
                     component={Dashboard}
                  />
                  <Route component={Routes} />
               </Switch>
               <Footer />
            </Fragment>
         </Router>
      </Provider>
   );
};

export default App;
