import React from "react";
import PropTypes from "prop-types";

import { Form } from "semantic-ui-react";

const PhoneInput = props => {
  const { errors, handleBlur, handleChange, placeholder, values } = props;

  const validate = event => {
    const { target: { name }, } = event;

    if (values[name] !== "") {
        const regEx = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/gm
        return !regEx.test(values[name]);
    } else {
        return false;    // Phone number is an optional field, so a blank is not an error
    }
  }

  return(
    <Form.Input
      className="fluid"
      icon="phone"
      iconPosition="left"
      name="phone"
      value={values.phone || ""}
      placeholder={placeholder}
      error={errors.phone}
      onBlur={(event) => handleBlur(validate(event), event)}
      onChange={handleChange}
    />
  );
}

PhoneInput.defaultProps = {
  placeholder: "Phone Number"
}

const { func, object, string } = PropTypes;

PhoneInput.propTypes = {
  errors: object,
  handleBlur: func,
  handleChange: func,
  placeholder: string,
  values: object
}

export default PhoneInput;
