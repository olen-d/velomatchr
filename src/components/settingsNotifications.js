import React from "react";

import { Grid, Header } from "semantic-ui-react";

import EmailNotificationForm from "./emailNotificationForm";

const SettingsNotifications = () => {

  return(
    <Grid.Column width={8}>
      <Header
        as="h2"
        color="grey"
      >
        My Notifications
      </Header>
      <Header
        as="h3"
        color="grey"
      >
        Email Me When
      </Header>
      <EmailNotificationForm submitBtnContent="Update Email Notifications" />
    </Grid.Column>
  );
}

export default SettingsNotifications;
