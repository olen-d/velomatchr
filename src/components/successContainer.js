import React from "react";
import PropTypes from "prop-types";

import {
  Message,
} from "semantic-ui-react"

const SuccessContainer = props => {
  const { header, message, show } = props;
  if(show) {
    return(
      <Message positive>
        <Message.Header>
          {header}
        </Message.Header>
        <Message.Content>
          {message} 
        </Message.Content>
      </Message>
    );
  } else {
    return(null);
  }
}

SuccessContainer.defaultProps = {
  header: "No Header Specified",
  message: "No message was provided.",
  show: false
}

SuccessContainer.propTypes = {
  header: PropTypes.string,
  message: PropTypes.string,
  show: PropTypes.bool
}

export default SuccessContainer;
