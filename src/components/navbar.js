import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Container, Image, Menu } from 'semantic-ui-react';

export default () => (
  <Menu color = { "inverted" }>
    <Container>
            <Menu.Item as={ Link } to="/">
               <i className="fas fa-bicycle"></i>
            </Menu.Item>
            <Menu.Menu position="right">
                <Menu.Item as={ Link } to="/survey">
                    Survey
                </Menu.Item>
                <Menu.Item as={ Link } to="/buddies">
                    Buddies
                </Menu.Item>
                <Menu.Item as={ Link } to="/messages">
                    Messages
                </Menu.Item>
                <Menu.Item as={ Link } to="/settings">
                    Settings
                </Menu.Item>
            </Menu.Menu>
    </Container>
  </Menu>
);
