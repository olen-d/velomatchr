import React from "react";
import PropTypes from "prop-types";

import { Form } from "semantic-ui-react";

const StateInput = props => {
  const { errors, handleBlur, handleChange, placeholder, values } = props;

  const validate = event => {
    const { target: { name }, } = event;

    return values[name] && values[name].length > 1 ? false : true;  // Short circuit to avoid error when attempting to read length of undefined
  }

  return(
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
  );
}

StateInput.defaultProps = {
  placeholder: "State"
}

StateInput.propTypes = {
  errors: PropTypes.object,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  placeholder: PropTypes.string,
  values: PropTypes.object
}

export default StateInput;
