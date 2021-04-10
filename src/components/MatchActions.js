import React from "react";
// import PropTypes from "prop-types";

import { Dropdown } from "semantic-ui-react";

const MatchActions = props => {
  const { postAction } = props;

  return(
    <Dropdown
      button
      className="icon large"
      floating
      icon="ellipsis horizontal"
    >
      <Dropdown.Menu>
        <Dropdown.Item content="Unfriend" icon="minus circle" onClick={() => postAction("updateStatus", 3)}/>
        <Dropdown.Item content="Block" icon="ban" onClick={() => postAction("updateStatus", 4)}/>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default MatchActions;
