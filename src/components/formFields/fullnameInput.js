import React, { useEffect } from "react";

import { Form, Popup } from "semantic-ui-react";

// import useForm from "../../hooks/useForm";

const FullnameInput = props => {
  const { errors, handleChange, initialValue, placeholder, setErrors, values } = props;

  // const { errors, setErrors, values, setValues } = useForm();

  // if(typeof values.fullname === "undefined") {
  //   setValues({
  //     ...values,
  //     fullname: ""
  //   })
  // }

  const handleBlur = event => {
    validate(event);
  }



  const validate = event => {
    const { target: { name }, } = event;

    if (values.fullname.length < 2) {
      setErrors({
        ...errors,
        [name]: true
      });
    } else {
      setErrors({
        ...errors,
        [name]: false
      });
    }
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
          value={values.fullname}
          placeholder={placeholder}
          error={errors.fullname}
          onBlur={handleBlur}
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
