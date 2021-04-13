import React from "react";

import { Grid, Header, Message  } from "semantic-ui-react";

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
      <Message>
        Tell us how you would like to be notified when you have new buddy requests or someone accepts your request. Leave unchecked if you do not wish to be notified.
      </Message>
      <Header
        as="h3"
        color="grey"
      >
        Email Notifications
      </Header>
      <EmailNotificationForm submitBtnContent="Update Email Notifications" />
    </Grid.Column>
  );
}

export default SettingsNotifications;
