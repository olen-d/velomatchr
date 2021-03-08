import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import * as auth from "./auth";

import { Button } from "semantic-ui-react";

import { useAuth } from "../context/authContext";

import CheckboxToggle from "./formFields/checkboxToggle";
import ErrorContainer from "./errorContainer";
import SuccessContainer from "./successContainer";

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
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSuccessHeader, setIsSuccessHeader] = useState(null);
  const [isSuccessMessage, setIsSuccessMessage] = useState(null);
  const [userId, setUserId] = useState(user);

  const { handleCheckboxChange, initializeFields, values } = useForm();

  const handleSubmit = async () => {
    const buildUpdateErrorString = updateErrors => {
      const updateErrorsJoin = updateErrors.join(", ");
      const updateErrorsString = updateErrorsJoin.replace(/,\s([^,]+)$/, ' and $1');
      return updateErrorsString;
    }
    const updateResult = await postUpdate();
    // TODO: Actually handle the errors and success using the error and success message component
    const updateResultCount = updateResult ? updateResult.length : null; 
    if (updateResultCount > 0) {
      setIsSuccess(false);

      // Check for fetch issues
      if (updateResult[0] === "fetchFail") {

        updateResult.shift();

        const updateResultString = buildUpdateErrorString(updateResult);
        const wasWere = updateResult.length > 1 ? "were" : "was";
        
        setIsErrorHeader("Unable to Update Email Notification Preferences");
        setIsErrorMessage(`The server appears to be down or unavailable. Please wait a few minutes and try again. ${updateResultString} ${wasWere} not updated.`);
        setIsError(true);
      } else {
        const errorHeaderText = updateResultCount > 1 ? "The Following Preferences Were Not Updated" : "The Following Preference Was Not Updated";

        setIsErrorHeader(errorHeaderText);
        const updateResultString = buildUpdateErrorString(updateResult);
        setIsErrorMessage(updateResultString);
        setIsError(true);
      }
    } else {
      setIsError(false);
      setIsSuccessHeader("Preferences Updated")
      setIsSuccessMessage("Your email notification preferences were successfuly updated.");
      setIsSuccess(true);
    }
  }

  const postUpdate = async () => {
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
        if (updateErrors[0] !== "fetchFail") { updateErrors.unshift("fetchFail") };
        return (false);
      }
    }

    const newBuddyResult = await updateNotificationPrefs("newBuddy");
    if (!newBuddyResult) { updateErrors.push("Someone accepts my riding buddy request") }
    const newRequestResult = await updateNotificationPrefs("newRequest");
    if (!newRequestResult) { updateErrors.push("I have new riding buddy requests") }
    return(updateErrors);
  }

  const options = [
    ["newRequest", "I have new riding buddy requests"],
    ["newBuddy", "Someone accepts my riding buddy request"]
  ]

  useEffect(() => { setUserId(user) }, [user]);
  
  // Get notification settings from the database
  useEffect(() => {
    const createNotificationPrefs = async () => {
      const formData = { userId };
  
      try {
        const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
        if (isNewAccessToken) { setAccessToken(token); }
  
        const createResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/preferences`, {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
  
        const createData = createResponse.ok ? await createResponse.json() : false;
  
        return (createData && createData.status === 201 ? true : false); 
      } catch(error) {
        return (false);
      }
    };

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
          if (response.status === 404) {
            // No preferences were found, we will need to create them
            const createResult = await createNotificationPrefs();
            if (!createResult) {
              // TODO: Failed to create. Deal with the error.
            }
          }
        } else {
          if (data.status === 200) {
            const { data: { userNotificationPrefs }, } = data;
            const emailNotificationPrefs = {};
  
            userNotificationPrefs.forEach(pref => {
              const { code, email } = pref;
              emailNotificationPrefs[code] = email;
            });
            setInitialValues(emailNotificationPrefs);
          } else {
            // TODO: deal with the error
          }
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
        <SuccessContainer
          header={isSuccessHeader}
          message={isSuccessMessage}
          show={isSuccess}
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
