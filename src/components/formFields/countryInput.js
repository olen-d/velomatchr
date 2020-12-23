import React from "react";
import PropTypes from "prop-types";

import { Form } from "semantic-ui-react";

const CountryInput = props => {
  const { errors, handleBlur, handleChange, placeholder, values } = props;

  const validate = event => {
    const { target: { name }, } = event;

    return values[name] && values[name].length > 1 ? false : true;  // Short circuit to avoid error when attempting to read length of undefined
  }

  return(
    <Form.Input
      className="fluid"
      icon="flag"
      iconPosition="left"
      name="country"
      value={values.country || ""}
      placeholder={placeholder}
      error={errors.country}
      onBlur={(event) => handleBlur(validate(event), event)}
      onChange={handleChange}
    />
  );
}

CountryInput.defaultProps = {
  placeholder: "Country"
}

const { func, object, string } = PropTypes;

CountryInput.propTypes = {
  errors: object,
  handleBlur: func,
  handleChange: func,
  placeholder: string,
  values: object
}

export default CountryInput;
