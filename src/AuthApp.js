import React, { useEffect } from "react";

import { useAuth } from "./context/authContext";

import { 
  Redirect,
  Route,
  Switch,
  useHistory
} from "react-router-dom";

import FourZeroFourAuth from "./components/fourZeroFourAuth";
import NavBar from "./components/navbar";

import Dashboard from "./pages/dashboard";
import Email from "./pages/email";
import FourZeroFour from "./pages/fourZeroFour";
import Home from "./pages/home";
import Matches from "./pages/matches";
import Onboarding from "./pages/onboarding";
import Settings from "./pages/settings";
import Survey from "./pages/survey";
import Verify from "./pages/verify";

import "./AuthApp.css";

const Template = () => {
  const { doRedirect, redirectURL, setDoRedirect } = useAuth();

  const history = useHistory();

  useEffect(() => {
    if (doRedirect) {
      setDoRedirect(false);
      history.push(redirectURL);
    }
  }, [doRedirect, history, redirectURL, setDoRedirect])

  return (
    <>
      <NavBar />
      <div className="auth-app-container">
        <Switch>
          <Route exact path="/" render={ () => <Redirect to="/dashboard" />} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/email" component={Email} />
          <Route path="/home" component={Home} />
          <Route path="/logout" render={ () => "LOGGED OUT"}/>
          <Route path="/matches" component={Matches} />
          <Route path="/onboarding" component={Onboarding} />
          <Route path="/settings" component={Settings} />
          <Route path="/survey" component={Survey} />
          <Route path="/verify" component={Verify} />
          <Route path="*" render={() => (<FourZeroFour><FourZeroFourAuth /></FourZeroFour>)} />
        </Switch>
      </div>
    </>
  );
}

export default Template;
