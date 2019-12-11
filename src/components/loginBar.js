import React, { Component } from "react";
import auth from "./auth";

import { 
  Link, 
} from "react-router-dom";

import {
  Container,
  Divider,
  Menu, 
  Button
} from 'semantic-ui-react';

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
    return(
      <Container>
        <Menu secondary>
          <Menu.Item as={Link} to="/" name="home">
            <i className="fas fa-bicycle"></i>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Button as={Link} to="/login" color="red">
                Sign In
              </Button>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <hr />
      </Container>
    );
  }
}
  
export default LoginBar;
  