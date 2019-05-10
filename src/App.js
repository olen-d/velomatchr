import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import "./materialize.css";
import "./style.css";

import Home from "./components/home";
import Survey from "./components/survey";
import Footer from "./components/footer";

function BasicExample() {
  return (
    <>
      <Router>
        <nav className="red accent-4" role="navigation">
          <div className="nav-wrapper container"><Link to="/"><i className="fas fa-bicycle"></i></Link>
            <ul className="right hide-on-med-and-down">
              <li>
                <Link to="/survey">Survey</Link>
              </li>
              <li>
                <Link to="/buddies">Buddies</Link>
              </li>
              <li>
                <Link to="/messages">Messages</Link>
              </li>
              <li>
                <Link to="/settings">Settings</Link>
              </li>  
            </ul>
          </div>
        </nav>
          <Route exact path="/" component={Home} />
          <Route path="/survey" component={Survey} />
          <Route path="/topics" component={Topics} />
      </Router>
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
