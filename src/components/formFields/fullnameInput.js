import React, { useEffect } from "react";

import { Form, Popup } from "semantic-ui-react";

const FullnameInput = props => {
  const { errors, handleBlur, handleChange, initialValue, placeholder, values } = props;

  const validate = event => {
    const { target: { name }, } = event;

    return values[name] && values[name].length > 1 ? false : true;  // Short circuit to avoid error when attempting to read length of undefined
  }

  // Set the user's full name if one was passed in with the props
  // Since the full name is coming from an asynchronus operation,
  // the full name might be defined in the first render, so useEffect
  // is needed to update the state in this component when it becomes
  // available in the parent.
  
  // useEffect(() => {
  //   setValues({
  //     fullname: initialValue
  //   });
  // }, [initialValue, setValues]);

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
  initialValue: "",
  placeholder: "First and Last Name"
}

export default FullnameInput;
