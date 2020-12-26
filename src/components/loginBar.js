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

import SignUpButton from "./signupButton";

const LoginButton = props => {
  const { buttonColor, buttonType } = props;

  if(buttonType === "basic") {
    return (
      <Button basic as={Link} to="/login" color={buttonColor}>
        Sign In
      </Button>
    );
  } else {
    return (
      <Button as={Link} to="/login" color={buttonColor}>
        Sign In
      </Button>
    );
  }
}

const LoginControl = () => {
  const matchHome = useRouteMatch("/home");
  const matchLogin = useRouteMatch("/login");
  const matchRoot = useRouteMatch("/");

  const loginButtonType = (matchHome && matchHome.isExact) || (matchRoot && matchRoot.isExact) ? "standard" : "basic";

  const button = (matchLogin && matchLogin.isExact) ? <SignUpButton buttonColor="red" buttonType="basic" /> : <LoginButton buttonColor="red" buttonType={loginButtonType} />;
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
