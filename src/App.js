import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "./style.css";

import Home from "./components/home";
import Survey from "./components/survey";
import Footer from "./components/footer";

function BasicExample() {
  return (
    <div className="ui page grid">
      <Router>
        <div class="computer tablet only row">
          <div className="ui inverted menu navbar">
            <Link to="/" className="item"><i className="fas fa-bicycle"></i></Link>
            <div className="right menu">
              <Link to="/survey" className="item">Survey</Link>
              <Link to="/buddies" className="item">Buddies</Link>
              <Link to="/messages" className="item">Messages</Link>
              <Link to="/settings" className="item">Settings</Link>
            </div>
          </div>
        </div>
          <Route exact path="/" component={Home} />
          <Route path="/survey" component={Survey} />
          <Route path="/topics" component={Topics} /> 
      </Router>
      <Footer />
    </div>
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
