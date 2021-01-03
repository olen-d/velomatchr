import React from "react";

import { Checkbox } from "semantic-ui-react";

const checkboxToggle = props => {
  const { handleChange, label, name, style } = props;

  return(
    <>
      <Checkbox toggle style={style} name={name} label={{ children: label }} onChange={handleChange} />
      <br />
    </>
  );
}

export default checkboxToggle;
