import React from "react";
// import "./styles.css";

const dropdownItems = props => {
  const { value, text } = props;
  return (
    <option
        value={value}
    >
        {text}
    </option>
  );
}

export default dropdownItems;
