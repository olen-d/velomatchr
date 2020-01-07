import React, { useContext } from "react";

import { 
  // BrowserRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";

import "./style.css";

import Footer from "./components/footer";
import NavBar from "./components/navbar";

import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import Matches from "./pages/matches";
import Survey from "./pages/survey";

import { AuthContext } from "./context/authContext";

const Template = () => {
  const ctx = useContext(AuthContext);
  let { toMatchPrefs } = ctx;
  console.log("AuthApp.js - 21 - toMatchPrefs: \n", toMatchPrefs);
  
  return (
    <>
      <NavBar />
      <AuthContext.Consumer>
        {
          ({toDashboard, toMatchPrefs, toSurvey}) => {
            if (toDashboard) {
              return <Redirect to="/dashboard" />
            }
            if (toMatchPrefs) {
              return <Redirect to="/matches/preferences/signup" />
            }
            if (toSurvey) {
              return <Redirect to="/survey" />
            }
          }
        }
      </AuthContext.Consumer>
        <Switch>
          {/* <Route exact path="/" render={ () => (<Redirect from="/" to="/dashboard" />) } /> */}
          <Redirect exact from="/" to="/dashboard" />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/home" component={Home} />
          <Route path="/logout" render={ () => "LOGGED OUT"}/>
          <Route path="/matches" component={Matches} />
          <Route path="/survey" component={Survey} />
          <Route path="*" render={ () => "404 NOT FOUND" } />
        </Switch>
      <Footer />
    </>
  );
}

export default Template;
