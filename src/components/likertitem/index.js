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

LikertItem.propTypes = {
  number: PropTypes.number,
  text: PropTypes.string
}

export default LikertItem;
