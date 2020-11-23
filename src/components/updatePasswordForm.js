import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";

import * as auth from "./auth";

import { Button, Form, Header, Segment } from "semantic-ui-react";

import { useAuth } from "../context/authContext";

import ConfirmPasswordModal from "./confirmPasswordModal";
import ErrorContainer from "./errorContainer";
import PasswordInput from "./formFields/passwordInput";
import SuccessContainer from "./successContainer";

import useForm from "../hooks/useForm";

const UpdatePasswordForm = props => {
  const { formTitle, submitBtnContent, submitRedirect, submitRedirectURL } = props;

  const { accessToken, setAccessToken, setDoRedirect, setRedirectURL } = useAuth();

  const { user } = auth.getUserInfo(accessToken);

  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPassVerified, setIsPassVerified] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessHeader, setIsSuccessHeader] = useState(null);
  const [isSuccessMessage, setIsSuccessMesssage] = useState(null);
  const [userId, setUserId] = useState(user);

  const {
    errors,
    handleBlur,
    handleChange,
    handleServerErrors,
    values
  } = useForm();

  const handleSubmit = () => {
    if (!isError) {
      setIsModalOpen(true);
    } else {
      // TODO: return failure
    }
  }
  
  const postUpdate = useCallback(() => {
    const { password } = values;

    if (userId) {
      (async () => {
        const formData = { userId, password };
  
        const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
        if (isNewAccessToken) { setAccessToken(token); }
  
        fetch(`${process.env.REACT_APP_API_URL}/api/users/password/change`, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        })
        .then(response => {
          return response.json();
        })
        .then(data => {
          if (data.status !== 200) {
            setIsSuccess(false);
            setIsErrorHeader("Unable to Change Password");
            setIsErrorMessage("Please enter a valid password and try again.")
            handleServerErrors(...[{ password: true }]);
          } else {
            if(submitRedirect) {
              setRedirectURL(submitRedirectURL);
              setDoRedirect(true);
            } else {
              setIsSuccessHeader("Your Password was Successfully Changed");
              setIsSuccessMesssage("You can now login using your new password.");
              setIsSuccess(true);
            }
          }
        })
        .catch(error => {
          return ({
            errorCode: 500,
            errorMsg: "Internal Server Error",
            errorDetail: error
          })
        });
      })();
    }
  }, [accessToken, handleServerErrors, setAccessToken, setDoRedirect, setRedirectURL, submitRedirect, submitRedirectURL, userId, values]);

  const handleIsPassVerified = isAuthenticated => {
    setIsPassVerified(isAuthenticated);
  }

  const handleClose = () => {
    setIsModalOpen(false);
  }

  useEffect(() => { setUserId(user) }, [user]);

  useEffect(() => {
    Object.values(errors).indexOf(true) > -1 ? setIsError(true) : setIsError(false);
  }, [errors]);

  useEffect(() => {
    if (isError && errors.password) {
      setIsErrorHeader("Invalid Password");
      setIsErrorMessage("Please entered a valid password and try again.");
    }
  }, [errors.password, isError]);

  useEffect(() => {
    if(isPassVerified === true) {
      postUpdate();
      setIsPassVerified(false);
    }
  }, [isPassVerified, postUpdate]);

  return(
    <>
      <Header 
        as="h3" 
        textAlign="left"
        color="grey"
      >
        {formTitle}
      </Header>
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
        <Form size="large">
          <PasswordInput 
            errors={errors}
            initialValue={values.password}
            placeholder="Password"
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
          <Button
            disabled={isError || !values.password}
            className="fluid"
            type="button"
            color="red"
            size="large"
            icon="check circle"
            labelPosition="left"
            content={submitBtnContent}
            onClick={handleSubmit}
          >
          </Button>
          <ConfirmPasswordModal
            actionNegative={"Cancel"}
            actionPositive={"Submit"}
            handleClose={handleClose}
            handleIsPassVerified={handleIsPassVerified}
            header={"Password Required"}
            isOpen={isModalOpen}
            message={"Please enter your old password."}
            userId={userId}
          />
        </Form>
      </Segment>
    </>
  );
}

UpdatePasswordForm.defaultProps = {
  formTitle: "My Password",
  submitBtnContent: "Update Password",
  submitRedirect: false,
  submitRedirectURL: ""
}

const { bool, string } = PropTypes;

UpdatePasswordForm.propTypes = {
  formTitle: string, 
  submitBtnContent: string,
  submitRedirect: bool, 
  submitRedirectURL: string
}

export default UpdatePasswordForm;
