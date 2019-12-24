import React from "react";

import { 
  // BrowserRouter as Router,
  Route,
  Switch,
  useHistory
} from "react-router-dom";

import "./style.css";

import Footer from "./components/footer"
import NavBar from "./components/navbar"

import Dashboard from "./pages/dashboard";
import Home from "./pages/home";
import Matches from "./pages/matches";
import Survey from "./pages/survey";

import { AuthContext } from "./context/authContext";

const Template = () => {
  let history = useHistory();

  return (
    // <Router>
    <>
      <NavBar />
      <AuthContext.Consumer>
        {
          ({toDashboard, toMatchPrefs}) => {
            if (toDashboard) {
              history.push("/dashboard")
            } else if (toMatchPrefs) {
              history.push("/matches/preferences")
            }
          }
        }
      </AuthContext.Consumer>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/home" component={Home} />
          <Route path="/logout" render={ () => "LOGGED OUT"}/>
          <Route path="/matches" component={Matches} />
          <Route path="/survey" component={Survey} />
          <Route path="*" render={ () => "404 NOT FOUND" } />
        </Switch>
      <Footer />
      </>
    // </Router>
  );
}

export default Template;
