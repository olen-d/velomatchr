import React from "react";

import { Checkbox } from "semantic-ui-react";

const checkboxToggle = props => {
  const { checked, handleChange, label, name, style } = props;

  return(
    <>
      <Checkbox toggle style={style} name={name} label={{ children: label }} onChange={handleChange} checked={checked} />
      <br />
    </>
  );
}

export default checkboxToggle;
