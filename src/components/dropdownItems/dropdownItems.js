import React from "react";
import PropTypes from "prop-types";
// import "./styles.css";

const DropdownItems = props => {
  const { value, text } = props;
  return (
    <option
        value={value}
    >
        {text}
    </option>
  );
}

DropdownItems.defaultProps = {
  value: "Default",
  text: "Default"
}

const { string } = PropTypes;

DropdownItems.propTypes = {
  value: string,
  text: string
}

export default DropdownItems;
