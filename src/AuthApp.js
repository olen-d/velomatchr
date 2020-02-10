import React, { useContext, useEffect, useState } from "react";

import { 
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
import Onboarding from "./pages/onboarding";
import Settings from "./pages/settings";
import Survey from "./pages/survey";

import { AuthContext } from "./context/authContext";

const Template = () => {
  const [doRedirect, setDoRedirect] = useState(false);

  const context = useContext(AuthContext);

  useEffect(() => { context.setDoRedirect(doRedirect)}, [context, doRedirect])

  return (
    <>
      <NavBar />
      <AuthContext.Consumer>
        {
          ({doRedirect, redirectURL}) => {
            if (doRedirect) {
              setDoRedirect(false);
              return <Redirect to={`${redirectURL}`} />
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
