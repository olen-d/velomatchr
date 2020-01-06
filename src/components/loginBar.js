import React from "react";

import {
  Link, 
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

const SignUpButton = props => {
  return (
    <Button as={Link} to="/signup" color="red">
      Sign Up
    </Button>
  );
}

const LoginControl = () => {
  const match = useRouteMatch("/login");
  const button = (match && match.isExact) ? <SignUpButton /> : <LoginButton />;
  return button;
}

const LoginBar = () => {
  return(
    <Container>
      <Menu secondary>
        <Menu.Item as={Link} to="/" name="home">
          <i className="fas fa-bicycle"></i>
        </Menu.Item>
        <Menu.Menu position="right">
          <Menu.Item>
            <LoginControl />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
      <Divider />
    </Container>
  );
}

export default LoginBar;
