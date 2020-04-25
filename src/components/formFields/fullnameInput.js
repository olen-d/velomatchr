import React from "react";

import { Form, Popup } from "semantic-ui-react";

const FullnameInput = props => {
  const { errors, handleBlur, handleChange, placeholder, values } = props;

  const validate = event => {
    const { target: { name }, } = event;

    return values[name] && values[name].length > 1 ? false : true;  // Short circuit to avoid error when attempting to read length of undefined
  }

  return(
    <Popup
      trigger={
        <Form.Input
          className="fluid"
          icon="user"
          iconPosition="left"
          name="fullname"
          value={values.fullname || ""}
          placeholder={placeholder}
          error={errors.fullname}
          onBlur={(event) => handleBlur(validate(event), event)}
          onChange={handleChange}
        />
      }
      content="Seperate first and last names with a space."
      on="focus"
    />
  );
}

FullnameInput.defaultProps = {
  placeholder: "First and Last Name"
}

export default FullnameInput;
