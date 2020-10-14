import React, { useContext, useState } from "react";

import { useRouteMatch } from "react-router-dom";

import PropTypes from "prop-types";

import {
  Dropdown
} from 'semantic-ui-react';

import { AuthContext } from "../context/authContext";

const NavDropdown = props => {
  const { items, title } = props;

  const [newValue, setNewValue] = useState(items[0].name);

  const context = useContext(AuthContext);
  const setDoRedirect = context.setDoRedirect;
  const setRedirectURL = context.setRedirectURL;

  const handleDropdown = (event, data) => {
    setRedirectURL(data.value);
    setDoRedirect(true);
  };

  let isRouteMatch = useRouteMatch("/matches");

  const checkRoute = () => {
    if (!isRouteMatch) {
      setNewValue(-99);
    }
  }

  return(
    <Dropdown
      item
      text={title}
      options={items}
      value={newValue}
      selectOnBlur={false}
      onClick={checkRoute}
      onChange={handleDropdown}
    />
  );
}

NavDropdown.defaultProps = {
  items: [],
  title: "No Title Provided"
}

const { array, string } = PropTypes;

NavDropdown.propTypes = {
  items: array,
  title: string
}

export default NavDropdown;
