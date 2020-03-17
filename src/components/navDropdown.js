import React, { useContext, useState } from "react";

import { useRouteMatch } from "react-router-dom";

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
      onClick={checkRoute}
      onChange={handleDropdown}
    />
  );
}

export default NavDropdown;
