import React, { useContext, useEffect, useState } from "react";
// import PropTypes from "prop-types";

import auth from "./auth";

import ProfilePhotoForm from "./profilePhotoForm";
import { Button, Form, Header, Segment } from "semantic-ui-react";

import { AuthContext } from "../context/authContext";

import CityInput from "./formFields/cityInput";
import CountryInput from "./formFields/countryInput"
import FullnameInput from "./formFields/fullnameInput";
import GenderInput from "./formFields/genderInput";
import PhoneInput from "./formFields/phoneInput";
import PostalCodeInput from "./formFields/postalCodeInput";
import StateInput from "./formFields/stateInput";
import UsernameInput from "./formFields/usernameInput";

import useForm from "../hooks/useForm";

import locator from "../helpers/locator";
import reverseGeocode from "../helpers/reverse-geocode";

const ProfileFullForm = props => {
  const { formTitle, submitBtnContent, submitRedirect, submitRedirectURL } = props;

  const [photoLink, setPhotoLink] = useState(null);

  const [flag, setFlag] = useState(true);

  const [address, setAddress] = useState({});
  const [addressDidChange, setAddressDidChange] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [isError, setIsError] = useState(false);
  const [newLatitude, setNewLatitude] = useState(0.0);
  const [newLongitude, setNewLongitude] = useState(0.0);
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

  const context = useContext(AuthContext);
  const token = context.authTokens;
  const setDoRedirect = context.setDoRedirect;
  const setRedirectURL = context.setRedirectURL;

  const userInfo = auth.getUserInfo(token);

  useEffect(() => { setUserId(userInfo.user) }, [userInfo.user]);

  useEffect(() => {
    const getUserProfile = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/id/${userId}`);
      const data = await response.json();

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
      }
    }
    getUserProfile();
  }, [userId]);

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
            fetch(`http://localhost:5000/api/states/code/${stateCode}`),
            fetch(`http://localhost:5000/api/countries/alphatwo/${countryCode}`)
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
    locator.locator().then(locatorRes => {
      if (locatorRes.status === 200) {
        setNewLatitude(locatorRes.latitude);
        setNewLongitude(locatorRes.longitude);
      } else {
        // TODO: Modal to get user address if they decline geolocation
      }
    });
  }

  const handleSubmit = () => {
    if (!isError) {
      postProfileUpdate();
    } else {
      // TODO: return failure
    }
  }

  const postProfileUpdate = () => {
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
        "Content-Type": "application/json"
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
      <ProfilePhotoForm
        formTitle={"Current Photograph"}
        profilePhotoBtnContent={"Upload Profile Photo"}
        photoLink={photoLink}
        userId={userId}
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
            placeholder="State"
            handleBlur={handleBlur}
            handleChange={handleChange}
            values={values}
          />
          <CountryInput
            errors={errors}
            initialValue={values.country}
            placeholder="Country"
            handleBlur={handleBlur}
            handleChange={handleChange}
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

// TODO: Add default props
// TODO: Add prop type checking

export default ProfileFullForm;
