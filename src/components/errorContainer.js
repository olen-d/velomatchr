import React from "react";
import PropTypes from "prop-types";

import {
  Message,
} from "semantic-ui-react"

const ErrorContainer = props => {
  const { header, message, show } = props;
  if(show) {
    return(
      <Message negative>
        <Message.Header>
          {header}
        </Message.Header>
        <p>
          {message} 
        </p>
      </Message>
    );
  } else {
    return(null);
  }
}

ErrorContainer.defaultProps = {
  header: "No Header Specified",
  message: "No message was provided.",
  show: false
}

ErrorContainer.propTypes = {
  header: PropTypes.string,
  message: PropTypes.string,
  show: PropTypes.bool
}

export default ErrorContainer;
