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

const { func, object, string } = PropTypes;

PasswordVerifyInput.propTypes = {
  errors: object,
  handleBlur: func,
  handleChange: func,
  placeholder: string,
  values: object
}

export default PasswordVerifyInput;
