import React, { useContext, useEffect, useState } from "react";

import { 
  Redirect,
  Route,
  Switch
} from "react-router-dom";

import "./style.css";

import auth from "./components/auth";

import Footer from "./components/footer";
import NavBar from "./components/navbar";

import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import Matches from "./pages/matches";
import Survey from "./pages/survey";

import { AuthContext } from "./context/authContext";

const Template = () => {
  const [userId, setUserId] = useState(null);

  const context = useContext(AuthContext);
  const token = context.authTokens;

  const userInfo = auth.getUserInfo(token);

  useEffect(() => { setUserId(userInfo.user) }, [userInfo.user])

  return (
    <>
      <NavBar />
      <AuthContext.Consumer>
        {
          ({toDashboard, toMatchCalcs, toMatchPrefs, toSurvey}) => {
            if (toDashboard) {
              return <Redirect to="/dashboard" />
            }
            if (toMatchCalcs) {
              return <Redirect to={`/matches/calculate/${userId}`} />
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
          <Route exact path="/" render={ () => ""} />
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
