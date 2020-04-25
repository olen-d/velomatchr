import React from "react";

import { Form, Popup } from "semantic-ui-react";

import DropdownItems from "../dropdownItems/dropdownItems"
import genderChoices from "../../models/genderChoices"

const GenderInput = props => {
  const { errors, handleBlur, handleChange, values } = props;

  const validate = event => {
    const { target: { name }, } = event;
    
    return values[name] || values[name] === "default" ? false: true;
  }

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

export default GenderInput;
