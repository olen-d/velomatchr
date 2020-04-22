import React, { useEffect } from "react";

import { Form, Popup } from "semantic-ui-react";

import DropdownItems from "../dropdownItems/dropdownItems"
import genderChoices from "../../models/genderChoices"

const GenderInput = props => {
  const { errors, handleBlur, handleChange, initialValue, values } = props;

  const validate = event => {
    const { target: { name }, } = event;
console.log("gender", values[name]);
    return values[name] || values[name] === "default" ? false: true;
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
          value={values.gender || "default"}
          error={errors.gender}
          onBlur={(event) => handleBlur(validate(event), event)}
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
