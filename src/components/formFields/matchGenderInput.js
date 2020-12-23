import React from "react";
import PropTypes from "prop-types";

import { Form } from "semantic-ui-react";

import DropdownItems from "../dropdownItems/dropdownItems";
import matchGenders from "../../models/matchGenders";

const MatchGenderInput = props => {
  const { errors, handleBlur, handleChange, values } = props;

  const validate = event => {
    const { target: { name }, } = event;

    return values[name] || values[name] === "default" ? false : true;
  }

  return(
    <Form.Input
      className="fluid"
      control="select"
      name="matchGenderPref"
      value={values.matchGenderPref || "default"}
      error={errors.matchGenderPref}
      onBlur={(event) => handleBlur(validate(event), event)}
      onChange={handleChange}
    >  
      <option
        key="-1"
        value="default"
        disabled
      >
        Select Genders to Match With
      </option>
      {matchGenders.map(matchGender => (
        <DropdownItems 
          key={matchGender.id}
          value={matchGender.value}
          text={matchGender.text}
        />
      ))}
    </Form.Input>
  );
}

const { func, object } = PropTypes;

MatchGenderInput.propTypes = {
  errors: object,
  handleBlur: func,
  handleChange: func,
  values: object
}

export default MatchGenderInput;
