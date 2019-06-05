import React from "react";
// import "./styles.css";

const GenderChoices = props => {
  return (
    <option
        value={props.value}
    >
        {props.text}
    </option>
  );
}

export default GenderChoices;
