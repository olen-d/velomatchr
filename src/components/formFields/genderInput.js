import React, { useEffect } from "react";

import { Form, Popup } from "semantic-ui-react";

// import useForm from "../../hooks/useForm";

import DropdownItems from "../dropdownItems/dropdownItems"
import genderChoices from "../../models/genderChoices"

const GenderInput = props => {
  const { errors, handleChange, initialValue, setErrors, values } = props;

  // const { errors, setErrors, values, setValues } = useForm();

  // if(typeof values.gender === "undefined") {
  //   setValues({
  //     gender: ""
  //   })
  // }

  const handleBlur = event => {
    validate(event);
  }

  // const handleChange = event => {
  //   const { target: { name, value }, } = event
  //   console.log("NAME:", name, "\nVALUE:", value);
  //   console.log("VALUES:", values);
  //   setValues({
  //     ...values,
  //     [name]: value,
  //     cow: "abunga"
  //   });
  // }

  const validate = event => {
    const { target: { name }, } = event;

    if (values.gender === "default") {
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

  // Set the user's gender if one was passed in with the props
  // Since the gender is coming from an asynchronus operation,
  // the gender might be defined in the first render, so useEffect
  // is needed to update the state in this component when it becomes
  // available in the parent.
  
  // useEffect(() => {
  //   setValues({
  //     gender: initialValue
  //   });
  // }, [initialValue, setValues]);

  return(
    <Popup
      trigger={
        <Form.Input
          className="fluid"
          control="select"
          name="gender"
          value={values.gender}
          error={errors.gender}
          onBlur={handleBlur}
          onChange={handleChange}
        >  
          <option
            key="-1"
            value="default"
            disabled
          >
            Select Your Gender
          </option>
          {genderChoices.map(genderChoice => (
            <DropdownItems 
              key={genderChoice.id}
              value={genderChoice.value}
              text={genderChoice.text}
            />
          ))}
        </Form.Input>   
      }
      content="VeloMatchr offers cyclists the option of matching with the same gender only. The gender chosen here will be used for same gender only matches."
      on="focus"
    />
  );
}

GenderInput.defaultProps = {
  initialValue: "default",
}

export default GenderInput;
