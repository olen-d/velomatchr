import React from "react";
import PropTypes from "prop-types";

import { Form } from "semantic-ui-react";

const BodyTextarea = props => {
  const { errors, handleBlur, handleChange, placeholder, values } = props;

  const validate = async event => {
    const { target: { name }, } = event;

    return values[name] && values[name].length > 1 ? false : true;  // Short circuit to avoid error when attempting to read length of undefined
  }

  return(
    <Form.TextArea
      className="fluid"
      name="body"
      value={values.body || ""}
      placeholder={placeholder}
      error={errors.body}
      onBlur={(event) => handleBlur(validate(event), event)}
      onChange={handleChange}
    />
  );
}

BodyTextarea.defaultProps = {
  placeholder: "Type a message..."
}

const { func, object, string } = PropTypes;

BodyTextarea.propTypes = {
  errors: object,
  handleBlur: func,
  handleChange: func,
  placeholder: string,
  values: object
}

export default BodyTextarea;
