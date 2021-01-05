import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import * as auth from "./auth";

import { Button } from "semantic-ui-react";

import { useAuth } from "../context/authContext";

import CheckboxToggle from "./formFields/checkboxToggle";
import ErrorContainer from "./errorContainer";

import useForm from "../hooks/useForm";

const checkboxStyle = { marginBottom: "1rem" }

const EmailNotificationCheckboxes = props => {
  const { submitBtnContent } = props;

  const { accessToken, setAccessToken } = useAuth(); // setDoRedirect, setRedirectURL 

  const { user } = auth.getUserInfo(accessToken);

  const [initialValues, setInitialValues] = useState({});
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [isInitialValuesSet, setIsInitialValuesSet] = useState(false);
  const [userId, setUserId] = useState(user);

  const { handleCheckboxChange, initializeFields, values } = useForm();

  const handleSubmit = async () => {
    const updateResult = await postUpdate();
    // TODO: Actually handle the errors and success using the error and success message component
    updateResult.length === 0 ? setIsErrorMessage("Success") : setIsErrorMessage(updateResult.join(" "));
    console.log(updateResult.length === 0 ? "Great Success!" : "Epic Fail!");
  }

  const postUpdate = () => {
    return new Promise(async (resolve, reject) => {
      const updateErrors = [];

      const updateNotificationPrefs = async code => {
        const setting = values[code];

        const formData = {
          userId,
          code,
          email: setting
        };

        try {
          const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
          if (isNewAccessToken) { setAccessToken(token); }

          const updateResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/preferences`, {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(formData)
          });
  
          const updateData = updateResponse.ok ? await updateResponse.json() : false;
  
          return (updateData && updateData.status === 200 ? true : false); 
        } catch(error) {
          // TODO: Deal with the error using the error message component
          console.log("ERROR\nemailNotificationForm.js\n", error);
          return (false);
        }
      }

      const newBuddyResult = await updateNotificationPrefs("newBuddy");
      if (!newBuddyResult) { updateErrors.push("newBuddy") }
      const newMatchResult = await updateNotificationPrefs("newMatch");
      if (!newMatchResult) { updateErrors.push("newMatch") }
      const newRequestResult = await updateNotificationPrefs("newRequest");
      if (!newRequestResult) { updateErrors.push("newRequest") }
      resolve(updateErrors);
    });
  }

  const options = [
    ["newRequest", "I have new riding buddy requests"],
    ["newMatch", "I have new potential matches"],
    ["newBuddy", "Someone accepts my riding buddy request"]
  ]

  useEffect(() => { setUserId(user) }, [user]);

  useEffect(() => { isErrorMessage ? setIsError(true) : setIsError(false)}, [isErrorMessage]);
  
  // Get notification settings from the database
  useEffect(() => {
    const getUserPrefs = async () => {
      try {
        const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
        if (isNewAccessToken) { setAccessToken(token); }
        
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/notifications/preferences/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = response.ok ? await response.json() : false;

        if (!data) {
          // There was an issue fetching the data
          // TODO: Deal with the error
        } else {
          const { data: { userNotificationPrefs }, } = data;
          const emailNotificationPrefs = {};

          userNotificationPrefs.forEach(pref => {
            const { code, email } = pref;
            emailNotificationPrefs[code] = email;
          })
          setInitialValues(emailNotificationPrefs);
        }
      } catch(error) {
        // TODO: Deal with the error
      }
    };
    if (userId) { getUserPrefs(); }
  }, [accessToken, setAccessToken, userId]);
  
  if (Object.keys(initialValues).length > 0 && !isInitialValuesSet) {
    initializeFields(initialValues);
    setIsInitialValuesSet(true);
  }

  return(
      <div>
        <ErrorContainer
          header={isErrorHeader}
          message={isErrorMessage}
          show={isError}
        />
        {
          options.map(([name, label], index) => (
            <CheckboxToggle label={label} style={checkboxStyle} name={name} handleChange={handleCheckboxChange} checked={values[name]} key={`checkbox${index}`} />
          ))
        }
        <Button
          disabled={Object.entries(values).length < 1}
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
      </div>
  );
}

EmailNotificationCheckboxes.defaultProps = {
  submitBtnContent: "Update Email Notifications"
};

const { string } = PropTypes;

EmailNotificationCheckboxes.propTypes = {
  submitBtnContent: string
}

export default EmailNotificationCheckboxes;
