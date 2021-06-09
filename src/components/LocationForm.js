import React, { useEffect, useState } from "react";

import PropTypes from "prop-types";

import * as auth from "./auth";

import { Button, Form, Header, Segment } from "semantic-ui-react";

import { useAuth } from "../context/authContext";

import CityInput from "./formFields/cityInput";
import CountryInput from "./formFields/countryInput";
import ErrorContainer from "./errorContainer";
import PostalCodeInput from "./formFields/postalCodeInput";
import StateInput from "./formFields/stateInput";
import StreetAddressInput from "./formFields/streetAddressInput";
import WarningContainer from "./warningContainer";

import useForm from "../hooks/useForm";

import forwardGeocode from "../helpers/forward-geocode";
import locator from "../helpers/locator";
import reverseGeocode from "../helpers/reverse-geocode";

const LocationForm = props => {
  const { formTitle, submitBtnContent, submitRedirect, submitRedirectURL } = props;

  // const [address, setAddress] = useState({});
  // const [addressDidChange, setAddressDidChange] = useState(false);
  const [flag, setFlag] = useState(true);
  const [initialValues, setInitialValues] = useState({});
  const [isError, setIsError] = useState(false);
  const [isFetchError, setIsFetchError] = useState(false);
  const [isFetchErrorHeader, setIsFetchErrorHeader] = useState(null);
  const [isFetchErrorMessage, setIsFetchErrorMessage] = useState(null);
  const [isWarning, setIsWarning] = useState(false);
  const [isWarningHeader, setIsWarningHeader] = useState(null);
  const [isWarningMessage, setIsWarningMessage] = useState(null);
  const [newLatitude, setNewLatitude] = useState(0.0);
  const [newLongitude, setNewLongitude] = useState(0.0);
  const [reverseGeocodeResultDidChange, setReverseGeocodeResultDidChange] = useState(false);
  const [reverseGeocodeResult, setReverseGeocodeResult] = useState({});
  const [userId, setUserId] = useState(null);


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

  // Style

  const extraMarginBottom = {
    marginBottom: "1.25rem"
  };

  if(Object.keys(initialValues).length > 0 && flag) {
    initializeFields(initialValues);
    setFlag(false);
  }

  if(Object.keys(reverseGeocodeResult).length > 0 && reverseGeocodeResultDidChange) {
    handleUpdateValues(reverseGeocodeResult);
    setReverseGeocodeResultDidChange(false);
  }

  // Functions
  const getNewLocation = async () => {
    try {
      const locatorResult = await locator.getPosition();

      if (locatorResult.status === 200) {
        const { latitude: currentLatitude, longitude: currentLongitude } = locatorResult;
        setNewLatitude(currentLatitude);
        setNewLongitude(currentLongitude);
      } else {
        // TODO: Modal to get user address if they decline geolocation
      }
    } catch (error) {
      if (error.status === 403) {
        setIsWarningHeader("Could Not Get Your Location");
        setIsWarningMessage("VeloMatchr uses your location to match you with nearby cyclists. It appears you have location services disabled. To get matched, please set your location manually below by filling in the Street Address, City, State, Country, and Postal Code Fields.");
        setIsWarning(true);
      } else if(error.status === 404) {
        setIsWarningHeader("Your Browser Does Not Support Location Services");
        setIsWarningMessage("VeloMatchr uses your location to match you with nearby cyclists. To get matched, please set your location manually below by filling in the Street Address, City, State, Country, and Postal Code Fields.");
        setIsWarning(true);
      }
    }
  }

  const handleDismiss = () => {
    setIsWarning(false);
  };

  const handleSubmit = async () => {
    // Check to see if City, State, Postalcode, or Country have changed using initial value
    const addressValues = ({ city, country, postalCode, state, streetAddress }) => [city, country, postalCode, state, streetAddress];

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
      } else {
        values.latitude = newLatitude;
        values.longitude = newLongitude;
      }
    }

    if (!isError) {
      postLocationUpdate();
    } else {
      // TODO: return failure
    }
  }

  const postLocationUpdate = async () => {
    const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, user);
    if (isNewAccessToken) { setAccessToken(token); }

    const {
      city,
      country,
      countryCode,
      latitude,
      longitude,
      postalCode,
      state,
      stateCode,
    } = values;
 
    const formData = {
      userId,
      city,
      country,
      countryCode,
      latitude,
      longitude,
      postalCode,
      state,
      stateCode,
    };

    try{
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/location/all`, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = response.ok ? await response.json() : false;

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
    } catch (error) {
      setIsFetchErrorHeader("Unable To Update Your Location");
      setIsFetchErrorMessage("Please wait a few minutes and try again.");
      setIsFetchError(true);
    }
  }

  // Hooks
  useEffect(() => { setUserId(user) }, [user]);

  useEffect(() => {
    if (userId) {
      const getUserProfile = async () => {
        const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
        if (isNewAccessToken) { setAccessToken(token); }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/location/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = response.status === 200 ? await response.json() : false;

        if (data && data.status === 200) { // Skips the destructuring if there was an error
          const streetAddress = null; // This is a special case because the street address is not stored in the database
          const {
            data: {
              city,
              country,
              countryCode,
              latitude,
              longitude,
              postalCode,
              state,
              stateCode
            },
          } = data;

          // Replace "Not Found" country or state with an empty string
          // The form will then display the placeholder text instead of "Not Found"
          const countryName = country === "Not Found" ? "" : country;
          const stateName = state === "Not Found" ? "" : state;

          setInitialValues({
            city,
            country: countryName,
            countryCode,
            latitude,
            longitude,
            postalCode,
            state: stateName,
            stateCode,
            streetAddress
          });

          setIsFetchError(false);
        } else {
            setIsFetchErrorHeader("Unable to Retrieve Your Location Information");
            setIsFetchErrorMessage("Please reload the page to try again.");
            setIsFetchError(true);
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

            setReverseGeocodeResult({ city, country, countryCode, postalCode, state, stateCode });
            setReverseGeocodeResultDidChange(true);
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

  return(
    <div className="locationForm">
      <Header 
        as="h2" 
        textAlign="left"
        color="grey"
      >
        {formTitle}
      </Header>
      <ErrorContainer
        header={isFetchErrorHeader}
        message={isFetchErrorMessage}
        show={isFetchError}>
      </ErrorContainer>
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
            style={extraMarginBottom}
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
        </Form>
      </Segment>
    </div>
  );
};

LocationForm.defaultProps = {
  formTitle: "My Location",
  submitBtnContent: "Update Location",
  submitRedirect: true,
  submitRedirectURL: "/dashboard"
};

const { bool, string } = PropTypes;

LocationForm.propTypes = {
  formTitle: string,
  submitBtnContent: string,
  submitRedirect: bool,
  submitRedirectURL: string
};

export default LocationForm;
