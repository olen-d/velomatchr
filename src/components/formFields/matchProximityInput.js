import React from "react";
import PropTypes from "prop-types";

import { Form } from "semantic-ui-react";

import DropdownItems from "../dropdownItems/dropdownItems";
import matchDistances from "../../models/matchDistances";

const MatchProximityInput = props => {
  const { errors, handleBlur, handleChange, values } = props;

  const validate = event => {
    const { target: { name }, } = event;

    return values[name] || values[name] === "default" ? false : true;
  }

  return(
    <Form.Input
      className="fluid"
      control="select"
      name="matchProximityPref"
      value={values.matchProximityPref || "default"}
      error={errors.matchProximityPref}
      onBlur={(event) => handleBlur(validate(event), event)}
      onChange={handleChange}
    >  
      <option
        key="-1"
        value="default"
        disabled
      >
        Select Match Proximity
      </option>
      {matchDistances.map(matchDistance => (
        <DropdownItems 
          key={matchDistance.id}
          value={matchDistance.value}
          text={matchDistance.text}
        />
      ))}
    </Form.Input>
  );
}

MatchProximityInput.propTypes = {
  errors: PropTypes.object,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  values: PropTypes.object
}

export default MatchProximityInput;
