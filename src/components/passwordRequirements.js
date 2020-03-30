import React from "react";

import { List } from "semantic-ui-react";

const PasswordRequirements = () => {
  return(
    <List>
      <List.Item>
        <List.Icon name="check" verticalAlign="middle"></List.Icon>
        <List.Content verticalAlign="middle">At least eight characters long</List.Content>
      </List.Item>
      <List.Item>
        <List.Icon name="check" verticalAlign="middle"></List.Icon>
        <List.Content verticalAlign="middle">Upper and lowercase letters</List.Content>
      </List.Item>
      <List.Item>
        <List.Icon name="check" verticalAlign="middle"></List.Icon>
        <List.Content verticalAlign="middle">At least one number or special character</List.Content>
      </List.Item>
    </List>
  );
}

export default PasswordRequirements;
