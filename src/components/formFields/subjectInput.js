import React from "react";
import PropTypes from "prop-types";

import { Form } from "semantic-ui-react";

const SubjectInput = props => {
  const { errors, handleBlur, handleChange, placeholder, values } = props;

  const validate = async event => {
    const { target: { name }, } = event;

    return values[name] && values[name].length > 1 ? false : true;  // Short circuit to avoid error when attempting to read length of undefined
  }

  return(
    <Form.Input
      className="fluid"
      icon="tag"
      iconPosition="left"
      name="subject"
      value={values.subject || ""}
      placeholder={placeholder}
      error={errors.subject}
      onBlur={(event) => handleBlur(validate(event), event)}
      onChange={handleChange}
    />
  );
}

SubjectInput.defaultProps = {
  placeholder: "Let's Ride Together"
}

const { func, object, string } = PropTypes;

SubjectInput.propTypes = {
  errors: object,
  handleBlur: func,
  handleChange: func,
  placeholder: string,
  values: object
}

export default SubjectInput;
