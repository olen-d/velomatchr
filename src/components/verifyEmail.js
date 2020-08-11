import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import auth from "./auth";

import { useAuth } from "../context/authContext";

import {
  Button,
  Form,
  Grid, 
  Header,
  Message,
  Segment
} from "semantic-ui-react";

import ErrorContainer from "./errorContainer";

const resendStyle = {
  background: "none",
  marginTop: "1.25rem",
  marginBottom: "0.5rem",
  marginLeft: "0rem",
  paddingTop: "0rem",
  paddingBottom: "0rem",
  paddingLeft: "0rem"
}

const VerifyEmail = props => {
  const { colWidth, formInstructions, formTitle, submitBtnContent, submitRedirect, submitRedirectURL } = props;

  // Set up the State for form error handling
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [isVerificationCodeError, setIsVerificationCodeError] = useState(false);
  // ...Rest of the State
  const [userId, setUserId] = useState(null);
  const [verificationCode, setVerificationCode] = useState(""); // React gets grumpy if the default is null

  const { authTokens: token, setDoRedirect, setRedirectURL } = useAuth();

  const userInfo = auth.getUserInfo(token);

  const postVerifyEmail = () => {
    const formData = {
      userId,
      verificationCode
    }

    // Form Validation
    let formError = false;

    if(verificationCode.length !== 6) {
      setIsVerificationCodeError(true);
      formError = true;
    } else {
      setIsVerificationCodeError(false);
    }

    if(formError)
      {
        setIsErrorHeader("Unable to verify your email address");
        setIsErrorMessage("Please check the fields in red and try again.");
        setIsError(true);
        return;
      } else {
        processForm(formData);
      }
  }

  const processForm = (formData) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/users/email/verify`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
      if(data.error || data.status === 403) { // TODO: clean up the controller to return a sensible status (e.g. 200 ok) and get rid of the or
        //TODO: Add error, message to the destructuring and show them when user has admin priv
        const { code } = data;
        const resendMessage = "Please click the \"Resend verification code\" link below to get a new code. ";

        setIsError(true);
        setIsErrorHeader("Unable to verify your email address");
        // TODO: Return sensible error codes from the controller and distinguish between 400/500 series and the codes, also controller should send the resend messages.
        switch (code) {
          case "903":
            setIsErrorMessage("Please make sure the code we sent you is entered correctly and try again.");
            break;
          case "904":
            setIsErrorMessage("No verification code was found. " + resendMessage);
            break;
          case "910":
            setIsErrorMessage("The code we sent you has expired. " + resendMessage);
            break;
          case "929":
            setIsErrorMessage("You've entered too many incorrect codes. " + resendMessage);
            break;
          default:
            setIsErrorMessage("Please make sure the code we sent you is entered correctly and try again.");
            break;
        }        
      } else {
        const formData = {
          id: userId,
          isEmailVerified: 1
        }

        fetch(`${process.env.REACT_APP_API_URL}/api/users/email/verified/update`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        })
        .then(response => {
          if (response.status === 200) {
            return response.json();
          } else {
            throw new Error("Response was not ok.")
          }
        })
        .then(data => {
          if(submitRedirect) {
            setRedirectURL(submitRedirectURL);
            setDoRedirect(true);
          }
        })
        .catch(error => {
          setIsError(true);
          setIsErrorHeader("Internal Server Error");
          setIsErrorMessage("The verification code you entered was correct. However there was a problem with the server and your email address has not been verified.")
         });
      }
    }).catch(error => {
      // Set isError to true
      console.log("verifyEmail.js ~118 - ERROR:\n", error);
    });
  }

  const resendEmail = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/users/email/verification/codes/delete/id/${userId}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if(!response.ok) {
        throw new Error ("Network response was not ok.");
      }
    })
    .catch(error => {
      console.log({ error });
    });

    fetch(`${process.env.REACT_APP_API_URL}/api/users/id/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        return response.ok ? response.json() : setIsErrorMessage({ error: response.statusText }); 
      })
      .then(json => {
        const { user: { email },} = json;
        const formData = ({ email, userId });

        fetch(`${process.env.REACT_APP_API_URL}/api/users/email/send/verification`, {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        })
        .then(response => {
          if(!response.ok) {
            throw new Error ("Network response was not ok.");
          }
          //TODO Update the success field on resend...
        })
        .catch(error => {
          console.log(error);
        });
      })
      .catch(error => {
        console.log(error);
      })
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
      <Message>
        {formInstructions}
      </Message>
      <ErrorContainer
        header={isErrorHeader}
        message={isErrorMessage}
        show={isError}
      />
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
            error={isVerificationCodeError}
            onChange={e => {
              setVerificationCode(e.target.value)
            }}
          />
          <Button
            disabled={!verificationCode}
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
        <Button
          style={resendStyle}
          as="a"
          content="Resend verification code"
          onClick={resendEmail}
        >
        </Button>
      </Segment>
    </Grid.Column>
  );
}

VerifyEmail.defaultProps = {
  colWidth: 6,
  formInstructions: "We sent a six digit code to your email address. Please enter it below to verify you have access to the account.",
  formTitle: "Verify Your Email Address",
  submitBtnContent: "Verify Email",
  submitRedirect: true,
  submitRedirectURL: "/dashboard"
}

VerifyEmail.propTypes = {
  colWidth: PropTypes.number,
  formInstructions: PropTypes.string,
  formTitle: PropTypes.string,
  submitBtnContent: PropTypes.string,
  submitRedirect: PropTypes.bool,
  submitRedirectURL: PropTypes.string
}

export default VerifyEmail;
