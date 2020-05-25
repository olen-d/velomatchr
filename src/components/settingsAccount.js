import React from "react";

import { Grid, Header } from "semantic-ui-react";

import UpdateEmailAddressForm from "./updateEmailAddressForm";
import UpdatePasswordForm from "./updatePasswordForm";

const SettingsAccount = () => {
  return(
    <Grid.Column width={8}>
      <Header 
        as="h2"
        textAlign="left"
        color="grey"
      >
        My Account
      </Header>
      <UpdateEmailAddressForm
        formTitle={"My Email Address"}
        submitBtnContent={"Update Email Address"}
        submitRedirect={false}
        submitRedirectURL={""}
      />
      <UpdatePasswordForm
        formTitle={"My Password"}
        submitBtnContent={"Update Password"}
        submitRedirect={false}
        submitRedirectURL={""}
      />
    </Grid.Column>
  );
};

export default SettingsAccount;
