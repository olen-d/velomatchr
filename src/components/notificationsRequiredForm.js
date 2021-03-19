import React from "react";

import { Grid, Header, Message } from "semantic-ui-react";

import EmailNotificationForm from "./emailNotificationForm";

const NotificationsRequiredForm = props => {
  const { colWidth, emailNotificationsTitle, firstHeadingAlign, formInstructions, formTitle, submitBtnContent } = props;

  return(
    <Grid.Column width={colWidth}>
      <Header
        as="h2"
        textAlign={firstHeadingAlign}
        color="grey"
      >
       {formTitle}
      </Header>
      <Message>
        {formInstructions}
      </Message>
      <Header
        as="h3"
        color="grey"
      >
        {emailNotificationsTitle}
      </Header>
      <EmailNotificationForm
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
  firstHeadingAlign: "center",
  formInstructions: "Tell us how you would like to be notified when you have new buddy requests or someone accepts your request. Leave unchecked if you do not wish to be notified.",
  formTitle: "Set Your Notification Preferences",
  submitBtnContent: "Save and Continue"
}

// TODO: Check PropTypes

export default NotificationsRequiredForm;
