import React from "react";

import { Grid, Header, Message } from "semantic-ui-react";

import EmailNotificationForm from "./emailNotificationForm";

const NotificationsRequiredForm = props => {
  const { colWidth, emailNotificationsTitle, formInstructions, formTitle, submitBtnContent } = props;

  return(
    <Grid.Column width={colWidth}>
      <Header
        as="h2"
        color="grey"
      >
       {formTitle}
      </Header>
      <Message>
        {formInstructions}
      </Message>

      <EmailNotificationForm
        formTitle={emailNotificationsTitle}
        submitBtnContent={submitBtnContent}
        submitRedirect={true}
        submitRedirectURL={"/dashboard"}
      />
    </Grid.Column>
  )
}

NotificationsRequiredForm.defaultProps = {
  colWidth: 6,
  emailNotificationsTitle: "Send Me an Email When:",
  formInstructions: "Tell us how you would like to be notified when you have new buddy requests or someone accepts your request. Leave unchecked if you do not wish to be notified.",
  formTitle: "Set Your Notification Preferences",
  submitBtnContent: "Save and Continue"
}

// TODO: Check PropTypes

export default NotificationsRequiredForm;
