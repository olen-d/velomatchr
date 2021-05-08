import React from "react";
import PropTypes from "prop-types";

import { Form, Popup } from "semantic-ui-react";

const StreetAddressInput = props => {
  const { errors, handleBlur, handleChange, placeholder, values } = props;

  const validate = event => {
    // const { target: { name }, } = event;

    return false;
    // return values[name] && values[name].length > 1 ? false : true;  // Short circuit to avoid error when attempting to read length of undefined
  }

  return(
    <Popup
      trigger={
        <Form.Input
          className="fluid"
          name="streetAddress"
          value={values.streetAddress || ""}
          placeholder={placeholder}
          error={errors.streetAddress}
          onBlur={(event) => handleBlur(validate(event), event)}
          onChange={handleChange}
        />
      }
      content="Please enter your street address. This is only required when manually updating your location. "
      on="focus"
    />
  )
};

StreetAddressInput.defaultProps = {
  placeholder: "Street Address"
}

const { func, object, string } = PropTypes;

StreetAddressInput.propTypes = {
  errors: object,
  handleBlur: func,
  handleChange: func,
  placeholder: string,
  values: object
}
export default StreetAddressInput;

