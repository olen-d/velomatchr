import React from "react";
import PropTypes from "prop-types";

import { Form, Popup } from "semantic-ui-react";

const StateInput = props => {
  const { errors, handleBlur, handleChange, placeholder, values } = props;

  const validate = event => {
    const { target: { name }, } = event;

    return values[name] && values[name].length > 1 ? false : true;  // Short circuit to avoid error when attempting to read length of undefined
  }

  return(
    <Popup
      trigger={
        <Form.Input
          className="fluid"
          icon="map pin"
          iconPosition="left"
          name="state"
          value={values.state || ""}
          placeholder={placeholder}
          error={errors.state}
          onBlur={(event) => handleBlur(validate(event), event)}
          onChange={handleChange}
        />
      }
      content="Please enter the name of your state."
      on="focus"
    />
  );
}

StateInput.defaultProps = {
  placeholder: "State"
}

const { func, string, object } = PropTypes;

StateInput.propTypes = {
  errors: object,
  handleBlur: func,
  handleChange: func,
  placeholder: string,
  values: object
}

export default StateInput;
