import React from "react";
import PropTypes from "prop-types";

import { Form } from "semantic-ui-react";

const CityInput = props => {
  const { errors, handleBlur, handleChange, placeholder, values } = props;

  const validate = event => {
    const { target: { name }, } = event;

    return values[name] && values[name].length > 1 ? false : true;  // Short circuit to avoid error when attempting to read length of undefined
  }

  return(
    <Form.Input
      className="fluid"
      icon="building"
      iconPosition="left"
      name="city"
      value={values.city || ""}
      placeholder={placeholder}
      error={errors.city}
      onBlur={(event) => handleBlur(validate(event), event)}
      onChange={handleChange}
    />
  );
}

CityInput.defaultProps = {
  placeholder: "City"
}

const { func, object, string } = PropTypes;

CityInput.propTypes = {
  errors: object,
  handleBlur: func,
  handleChange: func,
  placeholder: string,
  values: object
}

export default CityInput;
