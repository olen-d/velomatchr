import React, { useEffect, useState } from "react";

import auth from "./auth";

import { useAuth } from "../context/authContext";

import {
  Button,
  Form,
  Grid, 
  Header,
  Segment
} from "semantic-ui-react";

const VerifyEmail = props => {
  const { colWidth, formTitle, submitBtnContent, submitRedirect, submitRedirectURL } = props;

  const [userId, setUserId] = useState(null);
  const [verificationCode, setVerificationCode] = useState(""); // React gets grumpy if the default is null

  const { authTokens, setDoRedirect, setRedirectURL } = useAuth();

  const userInfo = auth.getUserInfo(authTokens);

  const postVerifyEmail = () => {
    const formData = {
      userId,
      verificationCode
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/users/email/verify`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }).then(response => {
      if(!response.ok) {
        throw new Error ("Network response was not ok.");
      }
      return response.json();
    }).then(data => {
      if(data.error) {
        // Fail...
      } else {
        // const id = data.userId;
        const formData = {
          id: userId,
          isEmailVerified: 1
        }

        fetch(`${process.env.REACT_APP_API_URL}/api/users/verified/update`, {
          method: "put",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        })
        .then(response => {
          // TODO: Great Success!
        })
        .catch(error => {
          // TODO: Deal with the error.
        });
        if(submitRedirect) {
          setRedirectURL(submitRedirectURL);
          setDoRedirect(true);
        }
      }
    }).catch(error => {
      // Set isError to true
      console.log("verifyEmail.js ~72 - ERROR:\n", error);
    });
  }

  useEffect(() => { setUserId(userInfo.user) }, [userInfo.user]);

  return(
    <Grid.Column width={colWidth}>
      <Header 
        as="h2" 
        textAlign="center"
        color="grey"
      >
        {formTitle}
      </Header>
      <Segment>
        <Form
          size="large"
        >
          <Form.Input
            className="fluid"
            icon="lock"
            iconPosition="left"
            name="verificationCode"
            value={verificationCode}
            placeholder="Verification Code"
            type="text"
            onChange={e => {
              setVerificationCode(e.target.value)
            }}
          />
          <Button
            className="fluid"
            type="button"
            color="red"
            size="large"
            icon="check circle"
            labelPosition="left"
            content={submitBtnContent}
            onClick={postVerifyEmail}
          >
          </Button>
        </Form>
      </Segment>
    </Grid.Column>
  );
}

export default VerifyEmail;
