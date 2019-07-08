import React from "react";
// import "./styles.css";

const dropdownItems = props => {
  return (
    <option
        value={props.value}
    >
        {props.text}
    </option>
  );
}

export default dropdownItems;
