import React from "react";

import { 
  BrowserRouter as Router, 
  Route,
  NavLink, 
  Link 
} from "react-router-dom";

import {
  Container,
  Menu 
} from 'semantic-ui-react';

import "./style.css";

import Home from "./pages/home";
import Survey from "./pages/survey";
import Login from "./pages/login";

import Footer from "./components/footer";

function BasicExample() {
  return (
    <>
      <Container>
        <Router>
          <Menu inverted color="red">
            <Menu.Item 
                as={ Link } to="/" name="home">
              <i className="fas fa-bicycle"></i>
            </Menu.Item>
            <Menu.Menu position="right">
                <Menu.Item as={ NavLink } to="/survey">
                  Survey
                </Menu.Item>
                <Menu.Item as={ NavLink } to="/buddies">
                  Buddies
                </Menu.Item>
                <Menu.Item as={ NavLink } to="/messages">
                  Messages
                </Menu.Item>
                <Menu.Item as={ NavLink } to="/settings">
                  Settings
                </Menu.Item>
                <Menu.Item as={ NavLink } to="/login">
                  Sign In
                </Menu.Item>
            </Menu.Menu>
          </Menu>
          <Route exact path="/" component={Home} />
          <Route path="/survey" component={Survey} />
          <Route path="/login" component={Login} /> 
        </Router>
        </Container>
        <Footer />
      </>
  );
}

function About() {
  return (
    <div>
      <h2>About</h2>
    </div>
  );
}

function Topics({ match }) {
  return (
    <div>
      <h2>Topics</h2>
      <ul>
        <li>
          <Link to={`${match.url}/rendering`}>Rendering with React</Link>
        </li>
        <li>
          <Link to={`${match.url}/components`}>Components</Link>
        </li>
        <li>
          <Link to={`${match.url}/props-v-state`}>Props v. State</Link>
        </li>
      </ul>

      <Route path={`${match.path}/:topicId`} component={Topic} />
      <Route
        exact
        path={match.path}
        render={() => <h3>Please select a topic.</h3>}
      />
    </div>
  );
}

function Topic({ match }) {
  return (
    <div>
      <h3>{match.params.topicId}</h3>
    </div>
  );
}

export default BasicExample;
