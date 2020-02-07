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
import Onboarding from "./pages/onboarding";
import Settings from "./pages/settings";
import Survey from "./pages/survey";

import { AuthContext } from "./context/authContext";

const Template = () => {
  const [userId, setUserId] = useState(null);
  const [doRedirect, setRedirect] = useState(false);

  const context = useContext(AuthContext);
  const token = context.authTokens;

  const userInfo = auth.getUserInfo(token);

  useEffect(() => { setUserId(userInfo.user) }, [userInfo.user])
  useEffect(() => { context.setDoRedirect(doRedirect)}, [context, doRedirect])

  return (
    <>
      <NavBar />
      <AuthContext.Consumer>
        {
          ({doRedirect, redirectURL, toDashboard, toMatchPrefs, toSurvey, updatedSurvey}) => {
            if (doRedirect) {
              return <Redirect to={`${redirectURL}`} />
            }
            if (toDashboard) {
              return <Redirect to="/dashboard" />
            }
            if (toMatchPrefs) {
              return <Redirect to="/matches/preferences/signup" />
            }
            if (toSurvey) {
              return <Redirect to="/survey" />
            }
            if (updatedSurvey) {
              // Hit the API route to calculate matches...
              fetch(`${process.env.REACT_APP_API_URL}/api/matches/calculate`, {
                method: "post",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId })
              }).then(response => {
                return response.json();
              }).then(data => {
                console.log("AuthApp.js - 59 DATA:\n", data);
                // setMatches()
              }).catch(err => {
                console.log("AuthApp.js - 61 Error:\n", err);
                // Do something about the err
              });
              return <Redirect to={`/matches`} />
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
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/settings" component={Settings} />
          <Route path="/survey" component={Survey} />
          <Route path="*" render={ () => "404 NOT FOUND" } />
        </Switch>
      <Footer />
    </>
  );
}

export default Template;
