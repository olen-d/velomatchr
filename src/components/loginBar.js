import React, { Component } from "react";
import auth from "./auth";

import {
  Link, 
  useLocation,
  useHistory,
  useRouteMatch
} from "react-router-dom";

import {
  Container,
  Divider,
  Menu, 
  Button
} from 'semantic-ui-react';

const LoginButton = props => {
  return (
    <Button as={Link} to="/login" color="red">
      Sign In
    </Button>
  );
}

const Home = () => {
  const location = useLocation();
  const history = useHistory();
  const match = useRouteMatch("/login");
  console.log("MATCH\n",match)
  let cheese;
  if (match.isExact) {
    cheese = "DORITOS";
  } else {
    cheese = "CHICKENPOTPIE";
  }

  return (
    <div>
    <h3>
      LOC PATH: {location.pathname}
    </h3>
    <h3>
      MATCH: {match.path} {cheese}
    </h3>
    </div>
  )
}

class LoginBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // State goes here...
    }
  }

  logout = () => {
    auth.logout();
  }





  render() {
    let button;

    button = <LoginButton />;
    return(
      <Container>
        <Menu secondary>
          <Menu.Item as={Link} to="/" name="home">
            <i className="fas fa-bicycle"></i>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              {button}
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <hr />
        <Home />
      </Container>
    );
  }
}
  
export default LoginBar;
  