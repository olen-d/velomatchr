import React, { useState } from "react";

import { Grid, Header } from "semantic-ui-react";

import UpdateEmailAddressForm from "./updateEmailAddressForm";
import UpdatePasswordForm from "./updatePasswordForm";
import VerifyEmail from "./verifyEmail";

const SettingsAccount = () => {
  // State
  const [showVerifyEmail, setShowVerifyEmail] = useState(false);

  const handleVerifyEmailFormVisibility = isVisible => {
    setShowVerifyEmail(isVisible);
  }

  return(
    <Grid.Column width={8}>
      <Header 
        as="h2"
        textAlign="left"
        color="grey"
      >
        My Account
      </Header>
      <VerifyEmail
        colWidth={8}
        formInstructions={"We sent a six digit code to the new email address you entered. Please enter it below to verify you have access to the account."}
        formTitle={"Verify Your Email Address"}
        handleVerifyEmailFormVisibility={handleVerifyEmailFormVisibility}
        show={showVerifyEmail}
        submitBtnContent={"Verify Email"}
        submitRedirect={false}
        submitRedirectURL={"/dashboard"}
      />
      <UpdateEmailAddressForm
        formTitle={"My Email Address"}
        handleVerifyEmailFormVisibility={handleVerifyEmailFormVisibility}
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
