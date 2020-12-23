import React from "react";
import PropTypes from "prop-types";

import { Form } from "semantic-ui-react";

const PostalCodeInput = props => {
  const { errors, handleBlur, handleChange, placeholder, values } = props;

  const validate = event => {
    const { target: { name }, } = event;
    // TODO: Fix this to validate post codes
    return values[name] && values[name].length > 1 ? false : true;  // Short circuit to avoid error when attempting to read length of undefined
  }

  return(
    <Form.Input
      className="fluid"
      icon="map pin"
      iconPosition="left"
      name="postalCode"
      value={values.postalCode || ""}
      placeholder={placeholder}
      error={errors.postalCode}
      onBlur={(event) => handleBlur(validate(event), event)}
      onChange={handleChange}
    />
  );
}

PostalCodeInput.defaultProps = {
  placeholder: "Postal Code"
}

const { func, object, string } = PropTypes;

PostalCodeInput.propTypes = {
  errors: object,
  handleBlur: func,
  handleChange: func,
  placeholder: string,
  values: object
}

export default PostalCodeInput;
