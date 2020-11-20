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
import SuccessContainer from "./successContainer";

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

  const { accessToken, setAccessToken, setDoRedirect, setRedirectURL } = useAuth();
  const { user } = auth.getUserInfo(accessToken);

  // Set up the State for form error handling
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessHeader, setIsSuccessHeader] = useState(null);
  const [isSuccessMessage, setIsSuccessMessage] = useState(null);
  const [isVerificationCodeError, setIsVerificationCodeError] = useState(false);
  // ...Rest of the State
  const [userId, setUserId] = useState(user);
  const [verificationCode, setVerificationCode] = useState(""); // React gets grumpy if the default is null

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

  const processForm = async formData => {
    const { isNewAccessToken, newAccessToken } = await auth.checkAccessTokenExpiration(accessToken, user);
    if (isNewAccessToken) { setAccessToken(newAccessToken); }

    fetch(`${process.env.REACT_APP_API_URL}/api/users/email/verify`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
      if(data && data.status !== 200) {
        //TODO: Add message to the destructuring and show it when user is logged in as an administrator
        const { status, error } = data;
        const resendMessage = "Please click the \"Resend verification code\" link below to get a new code.";
        const tryAgainMessage = "Please make sure the code we sent is entered correctly and try again."

        setIsError(true);
        setIsErrorHeader("Unable to verify your email address");

        switch (status) {
          case 400:
            setIsErrorMessage(`${error} ${tryAgainMessage}`);
            break;
          case 404:
            setIsErrorMessage(`${error} ${resendMessage}`);
            break;
          case 410:
            setIsErrorMessage(`${error} ${resendMessage}`);
            break;
          case 429:
            setIsErrorMessage(`${error} ${resendMessage}`);
            break;
          default:
            setIsErrorMessage(tryAgainMessage);
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
            Authorization: `Bearer ${accessToken}`
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

  const resendEmail = async () => {
    const { isNewAccessToken, newAccessToken } = await auth.checkAccessTokenExpiration(accessToken, user);
    if (isNewAccessToken) { setAccessToken(newAccessToken); }

    fetch(`${process.env.REACT_APP_API_URL}/api/users/email/verification/codes/id/${userId}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
    .then(response => {
      if(!response.ok) {
        setIsError(true);
        setIsErrorHeader("Network Error");
        setIsErrorMessage("The verification code could not be resent because of a connectivity issue. Please try again.");
        return false;
      }
    })
    .catch(error => {
      // TODO: Deal with the error
      console.log({ error });
    });

    fetch(`${process.env.REACT_APP_API_URL}/api/users/id/${userId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then(response => {
        return response.ok ? response.json() : setIsErrorMessage({ error: response.statusText }); 
      })
      .then(json => {
        const { user: { email }, } = json;
        const formData = ({ email, userId });

        fetch(`${process.env.REACT_APP_API_URL}/api/users/email/send/verification`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(formData)
        })
        .then(response => {
          if(!response.ok) {
            throw new Error ("Network response was not ok.");
          } else {
            //TODO Update the success field on resend...
            response.json().then(jsonSendMail => {
              const {data: { rejected }, } = jsonSendMail;
              if (rejected.length === 0) {
                setIsSuccess(true);
                setIsSuccessHeader("Verification Code Sent");
                setIsSuccessMessage("A new verification code was successfully sent to the your email address.");
              } else {
                // Mail was rejected by the receiving server
                // TODO: Log the error
                setIsError(true);
                setIsErrorHeader("Email Rejected");
                setIsErrorMessage("The message containing the verification code was rejected by the email server.");
              }
            })
            .catch(error => {
              console.log(error)
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
      })
      .catch(error => {
        console.log(error);
      })
    }

  useEffect(() => { setUserId(user) }, [user]);

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
      <SuccessContainer
        header={isSuccessHeader}
        message={isSuccessMessage}
        show={isSuccess}
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

const { bool, number, string } = PropTypes;

VerifyEmail.propTypes = {
  colWidth: number,
  formInstructions: string,
  formTitle: string,
  submitBtnContent: string,
  submitRedirect: bool,
  submitRedirectURL: string
}

export default VerifyEmail;
