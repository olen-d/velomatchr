import React from "react";
import PropTypes from "prop-types";

import { Form } from "semantic-ui-react";

import passwordValidate from "../../helpers/password-validate";

const PasswordVerifyInput = props => {
  const { errors, handleBlur, handleChange, placeholder, values } = props;

  const validate = async event => {
    const { target: { name }, } = event;

    const isValid = await passwordValidate.validatePassword(values[name]);
    return isValid ? false : true
  }

  return(
    <Form.Input
      className="fluid"
      icon="lock"
      iconPosition="left"
      name="passwordVerify"
      value={values.passwordVerify || ""}
      placeholder={placeholder}
      type={"password"}
      error={errors.passwordVerify}
      onBlur={(event) => handleBlur(validate(event), event)}
      onChange={handleChange}
    />
  );
}

PasswordVerifyInput.defaultProps = {
  placeholder: "Password"
}

PasswordVerifyInput.propTypes = {
  errors: PropTypes.object,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  placeholder: PropTypes.string,
  values: PropTypes.object
}

export default PasswordVerifyInput;
