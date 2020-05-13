import React from "react";
import PropTypes from "prop-types";

import { Form, Popup } from "semantic-ui-react";

import PasswordRequirements from "../passwordRequirements";

const PasswordInput = props => {
  const { errors, handleBlur, handleChange, placeholder, values } = props;

  const validate = event => {
    const { target: { name }, } = event;
    // TODO - fix this to use the passsword validator
    return values[name] && values[name].length > 1 ? false : true;  // Short circuit to avoid error when attempting to read length of undefined
  }

  return(
    <Popup
      trigger={
        <Form.Input
          className="fluid"
          icon="lock"
          iconPosition="left"
          name="password"
          value={values.password || ""}
          placeholder={placeholder}
          type={"password"}
          error={errors.password}
          onBlur={(event) => handleBlur(validate(event), event)}
          onChange={handleChange}
        />
      }
      content={PasswordRequirements}
      on="focus"
    />
  );
}

PasswordInput.defaultProps = {
  placeholder: "Password"
}

PasswordInput.propTypes = {
  errors: PropTypes.object,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  placeholder: PropTypes.string,
  values: PropTypes.object
}

export default PasswordInput;
