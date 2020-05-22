import React from "react";
import PropTypes from "prop-types";

import { Form, Popup } from "semantic-ui-react";

import PasswordRequirements from "../passwordRequirements";

import passwordValidate from "../../helpers/password-validate";

const PasswordInput = props => {
  const { errors, handleBlur, handleChange, placeholder, values } = props;

  const validate = async event => {
    const { target: { name }, } = event;

    const isValid = await passwordValidate.validatePassword(values[name]);
    return isValid ? false : true
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
