import React from "react";
import PropTypes from "prop-types";

import { Form } from "semantic-ui-react";

const EmailInput = props => {
  const { errors, handleBlur, handleChange, placeholder, values } = props;

  const validate = async event => {
    const { target: { name }, } = event;

    const expression = /.+@.+\..+/i;

    if(expression.test(String(values[name]).toLowerCase())) {
      const result = await fetch(`${process.env.REACT_APP_API_URL}/api/mail/check-mx/${values[name]}`);
      const data = await result.json();
      const { mxExists } = data;

      return mxExists ? false : true;
    } else {
      return true;
    }
  }

  return(
    <Form.Input
      className="fluid"
      icon="envelope"
      iconPosition="left"
      name="email"
      value={values.email || ""}
      placeholder={placeholder}
      type="email"
      error={errors.email}
      onBlur={(event) => handleBlur(validate(event), event)}
      onChange={handleChange}
    />
  );
}

EmailInput.defaultProps = {
  placeholder: "Email Address"
}

const { func, object, string } = PropTypes;

EmailInput.propTypes = {
  errors: object,
  handleBlur: func,
  handleChange: func,
  placeholder: string,
  values: object
}

export default EmailInput;
