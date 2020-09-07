import React from "react";

import {
  Container,
  Grid
} from "semantic-ui-react";

import ComposeEmailForm from "./../components/composeEmailForm";

const Email = () => {
  return(
    <Container>
      <Grid stackable>
      <ComposeEmailForm
          colWidth={6}
          formTitle={"Email"}
        />
      </Grid>
    </Container>
  );
}

export default Email;
