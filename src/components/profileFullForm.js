import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import * as auth from "./auth";

import ProfilePhotoForm from "./profilePhotoForm";
import { Button, Form, Header, Segment } from "semantic-ui-react";

import { useAuth } from "../context/authContext";

import ErrorContainer from "./errorContainer";

import CityInput from "./formFields/cityInput";
import CountryInput from "./formFields/countryInput"
import FullnameInput from "./formFields/fullnameInput";
import GenderInput from "./formFields/genderInput";
import PhoneInput from "./formFields/phoneInput";
import PostalCodeInput from "./formFields/postalCodeInput";
import StateInput from "./formFields/stateInput";
import StreetAddressInput from "./formFields/streetAddressInput";
import UsernameInput from "./formFields/usernameInput";
import WarningContainer from "./warningContainer";

import useForm from "../hooks/useForm";

import locator from "../helpers/locator";
import forwardGeocode from "../helpers/forward-geocode";
import reverseGeocode from "../helpers/reverse-geocode";

const ProfileFullForm = props => {
  const { formTitle, submitBtnContent, submitRedirect, submitRedirectURL } = props;

  const [photoLink, setPhotoLink] = useState(null);

  const [flag, setFlag] = useState(true);

  const [address, setAddress] = useState({});
  const [addressDidChange, setAddressDidChange] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [isError, setIsError] = useState(false);
  const [isUserProfileError, setIsUserProfileError] = useState(false);
  const [newLatitude, setNewLatitude] = useState(0.0);
  const [newLongitude, setNewLongitude] = useState(0.0);
  const [userId, setUserId] = useState(null);
  const [isWarning, setIsWarning] = useState(false);
  const [isWarningHeader, setIsWarningHeader] = useState(null);
  const [isWarningMessage, setIsWarningMessage] = useState(null);

  const {
    errors,
    handleBlur,
    handleChange,
    handleServerErrors,
    handleUpdateValues,
    initializeFields,
    values
  } = useForm();

  const { accessToken, setAccessToken, setDoRedirect, setRedirectURL } = useAuth();

  const { user } = auth.getUserInfo(accessToken);

  useEffect(() => { setUserId(user) }, [user]);

  useEffect(() => {
    if (userId) {
      const getUserProfile = async () => {
        const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
        if (isNewAccessToken) { setAccessToken(token); }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/id/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = response.status === 200 ? await response.json() : false;

        if (data && data.user) { // Skips the destructuring if any of these are null, which would throw a type error
          const {
            user: {
              city,
              country,
              countryCode,
              firstName,
              lastName,
              gender,
              latitude,
              longitude,
              name: username,
              phone,
              photoLink: initialPhotoLink,
              postalCode,
              state,
              stateCode
            },
          } = data;

          const fullname = firstName || lastName ? `${firstName} ${lastName}` : "";

          setInitialValues({
            city,
            country,
            countryCode,
            fullname,
            gender,
            latitude,
            longitude,
            phone,
            postalCode,
            state,
            stateCode,
            username
          });

          setPhotoLink(initialPhotoLink);
          setIsUserProfileError(false);
        } else {
            setIsUserProfileError(true);
        }
      }
      getUserProfile();
    }
  }, [accessToken, setAccessToken, userId]);

  useEffect(() => {
    Object.values(errors).indexOf(true) > -1 ? setIsError(true) : setIsError(false);
  }, [errors]);

  useEffect(() => {
    if (newLatitude !== 0 && newLongitude !== 0) {
      reverseGeocode.reverseGeocode(newLatitude, newLongitude).then(locationRes => {
        locationRes.json().then(locationRes => {
          const location = locationRes.results[0].locations[0];
          const { 
            adminArea1: countryCode = "BLANK",
            adminArea3: stateCode = "BLANK",
            adminArea5: city = "",
            postalCode = ""
          } = location

          Promise.all([
            fetch(`${process.env.REACT_APP_API_URL}/api/states/code/${stateCode}`),
            fetch(`${process.env.REACT_APP_API_URL}/api/countries/alphatwo/${countryCode}`)
          ])
          .then(responses => {
            const data = responses.map(response => response.json());
            return Promise.all(data);
          })
          .then(data => {
            const [ { state: { name: state }, },  { country: { name: country }, } ] = data;

            setAddress({ city, country, countryCode, postalCode, state, stateCode });
            setAddressDidChange(true)
          })
          .catch(error => {
            console.log("ERROR: ", error);
          });
        })
      })
      .catch(error => {
        // TODO: Deal with the error
        console.log(error);
      });
    }
  }, [newLatitude, newLongitude]);

  if(Object.keys(initialValues).length > 0 && flag) {
    initializeFields(initialValues);
    setFlag(false);
  }
  
  if(Object.keys(address).length > 0 && addressDidChange) {
    handleUpdateValues(address);
    setAddressDidChange(false);
  }

  const getNewLocation = () => {
    locator.getPosition().then(locatorRes => {
      if (locatorRes.status === 200) {
        setNewLatitude(locatorRes.latitude);
        setNewLongitude(locatorRes.longitude);
      } else {
        // TODO: Modal to get user address if they decline geolocation
      }
    })
    .catch(error => {
      if (error.status === 403) {
        setIsWarningHeader("Could Not Get Your Location");
        setIsWarningMessage("VeloMatchr uses your location to match you with nearby cyclists. It appears you have location services disabled. To get matched, please set your location manually below by filling in the City, State, Country, and Postal Code Fields.");
        setIsWarning(true);
      } else if(error.status === 404) {
        setIsWarningHeader("Your Browser Does Not Support Location Services");
        setIsWarningMessage("VeloMatchr uses your location to match you with nearby cyclists. To get matched, please set your location manually below by filling in the City, State, Country, and Postal Code Fields.");
        setIsWarning(true);
      }
    });
  }

  const handleDismiss = () => {
    setIsWarning(false);
  };

  const handleSubmit = async () => {
    // Check to see if City, State, Postalcode, or Country have changed using initial value
    const addressValues = ({ city, country, postalCode, state }) => [city, country, postalCode, state];

    const initialAddressValues = addressValues(initialValues);
    const currentAddressValues = addressValues(values);

    const uniqueAddressValues = new Set([...initialAddressValues, ...currentAddressValues]);

    if (initialAddressValues.length !== uniqueAddressValues.size) {
      // Something changed, check to see if the lat/long have been updated
      if (Math.round(newLatitude) === 0 && Math.round(newLongitude) === 0) {
        const { city, country, postalCode, stateCode, streetAddress } = values;
        const response = await forwardGeocode.forwardGeocode(city, country, postalCode, stateCode, streetAddress);
        const responseJson = response.ok ? await response.json() : "Error";

        const { results: [{ locations: [{ latLng: { lat, lng }, }] }] } = responseJson; 

        values.latitude = lat;
        values.longitude = lng;
      }
    }

    if (!isError) {
      postProfileUpdate();
    } else {
      // TODO: return failure
    }
  }

  const postProfileUpdate = async () => {
    const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, user);
    if (isNewAccessToken) { setAccessToken(token); }

    const {
      city,
      country,
      countryCode,
      fullname,
      gender,
      latitude,
      longitude,
      phone,
      postalCode,
      state,
      stateCode,
      username: name
    } = values;
 
    const formData = {
      userId,
      city,
      country,
      countryCode,
      fullname,
      gender,
      latitude,
      longitude,
      phone,
      postalCode,
      state,
      stateCode,
      name
    };

    fetch(`${process.env.REACT_APP_API_URL}/api/users/profile/update/full`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    }).then(response => {
      return response.json();
    }).then(data => {
      if (data.errors) {
        const { errors } = data;
        // TODO: fix profileRequiredForm.js 
        handleServerErrors(...errors);
      } else {
        if(submitRedirect) {
          setRedirectURL(submitRedirectURL);
          setDoRedirect(true);
        }
      }
    }).catch(error => {
      return ({
        errorCode: 500,
        errorMsg: "Internal Server Error",
        errorDetail: error
      })
    });
  }

  return(
    <>
      <Header 
        as="h2" 
        textAlign="left"
        color="grey"
      >
        {formTitle}
      </Header>
      <ErrorContainer
        header="Unable to Retrieve Your Profile"
        message="Please reload the page to try again."
        show={isUserProfileError}>
      </ErrorContainer>
      <ProfilePhotoForm
        formTitle={"Current Photograph"}
        profilePhotoBtnContent={"Upload Profile Photo"}
        photoLink={photoLink}
      />
      <Header
        as="h3"
        text-align="left"
        color="grey"
      >
        My Personal Information
      </Header>
      <Segment>
        <Form size="large">
          <UsernameInput 
            errors={errors}
            initialValue={values.fullname}
            placeholder="User Name"
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
          <FullnameInput
            errors={errors}
            initialValue={values.fullname}
            placeholder="First and Last Name"
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
          <GenderInput 
            errors={errors}
            initialValue={values.gender} 
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
          <PhoneInput
            errors={errors}
            initialValue={values.phone}
            placeholder="Phone Number"
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
        </Form>
      </Segment>
      <Header
        as="h3"
        text-align="left"
        color="grey"
      >
        My Location
      </Header>
      <WarningContainer
        handleDismiss={handleDismiss}
        header={isWarningHeader}
        message={isWarningMessage}
        show={isWarning}
      />
      <Segment>
        <Form size="large">
          <Button
            basic
            type="button"
            color="red"
            size="large"
            icon="compass"
            labelPosition="left"
            content="Use My Current Location"
            onClick={getNewLocation}
          >
          </Button>
          <StreetAddressInput
            errors={errors}
            initialValue=""
            placeholder="Street Address"
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
          <CityInput
            errors={errors}
            initialValue={values.city}
            placeholder="City"
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
          <StateInput
            errors={errors}
            initialValue={values.state}
            placeholder="Choose your state..."
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleUpdateValues={handleUpdateValues}
            values={values}
          />
          <CountryInput
            errors={errors}
            initialValue={values.country}
            placeholder="Choose your country..."
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleUpdateValues={handleUpdateValues}
            values={values}
          />
          <PostalCodeInput
            errors={errors}
            initialValue={values.postalCode}
            placeholder="Postal Code"
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
        </Form>
      </Segment>
      <Button
          disabled={isError}
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
    </>
  );
}

ProfileFullForm.defaultProps = {
  formTitle: "My Profile",
  submitBtnContent: "Update Profile",
  submitRedirect: true,
  submitRedirectURL: "/dashboard"
}

const { bool, string } = PropTypes;

ProfileFullForm.propTypes = {
  formTitle: string,
  submitBtnContent: string,
  submitRedirect: bool,
  submitRedirectURL: string
}

export default ProfileFullForm;
