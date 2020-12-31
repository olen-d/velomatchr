import React from "react";

import { Checkbox } from "semantic-ui-react";

const checkboxToggle = props => {
  const { labelText } = props;

  return(
    <Checkbox toggle label={{ children: labelText }} />
  );
}

export default checkboxToggle;
