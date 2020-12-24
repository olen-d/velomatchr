import React from "react";
import PropTypes from "prop-types";

// import "./styles.css";

const LikertItem = props => {
  const { number, text } = props;
  return (
    <option
        value={number}
    >
        {number + ". " + text}
    </option>
  );
}

LikertItem.defaultProps = {
  number: 0,
  text: "Error: No answer was specified."
}

const { number, string } = PropTypes;

LikertItem.propTypes = {
  number: number,
  text: string
}

export default LikertItem;
