import React from "react";

import { Grid, Header } from "semantic-ui-react";

import LoginInformationForm from "./loginInformationForm";

const SettingsAccount = () => {
  return(
    <>
      <Grid.Column width={8}>
        <Header 
          as="h1"
          color="orange"
        >
          Account
        </Header>
      </Grid.Column>
      <Grid.Column width={8}>
        <LoginInformationForm
          formTitle={"Login Information"}
          submitBtnContent={"Update Login Information"}
          submitRedirect={false}
          submitRedirectURL={""}
        />
      </Grid.Column>
    </>
  );
};

export default SettingsAccount;
