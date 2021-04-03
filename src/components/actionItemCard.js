import React from "react";
import PropTypes from "prop-types";

// import { Redirect } from "react-router-dom";

import { useAuth } from "../context/authContext";

// import * as auth from "./auth";

import { Button, Header } from "semantic-ui-react";
import "./actionItemCard.css";

const ActionItemCard = props => {
  const { action, headline, message, submitRedirectURL } = props;

  const { setDoRedirect, setRedirectURL } = useAuth(); 

  const handleSubmit = () => {
    setRedirectURL(submitRedirectURL);
    setDoRedirect(true);
  };

  return(
    <div className="action-item-card">
      <Header as="h2" color="orange">
        {headline}
      </Header>
      <div className="action-item-message">
        <p>
          {message}
        </p>
      </div>
      <div className="action-item-action">
        <Button
          basic
          color="red"
          size="large"
          onClick={handleSubmit}
        >
          {action}
        </Button>
      </div>
    </div>
  );
};

ActionItemCard.defaultProps = {
  action: "No Action Specified",
  headline: "No Headline Specified",
  message: "No message was specified",
  submitRedirectURL: "/dashboard"
}

const { string } = PropTypes;

ActionItemCard.propTypes = {
  action: string,
  headline: string,
  message: string,
  submitRedirectURL: string
}

export default ActionItemCard;
