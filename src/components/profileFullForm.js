import React, { useContext, useEffect, useState } from "react";
// import PropTypes from "prop-types";

import auth from "./auth";

import ProfilePhotoForm from "./profilePhotoForm";
import ProfileRequiredForm from "./profileRequiredForm";
import { Form, Grid } from "semantic-ui-react";

import { AuthContext } from "../context/authContext";


const ProfileFullForm = () => {
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState(null);
  const [fullName, setFullName] = useState(null);
  const [gender, setGender] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [phone, setPhone] = useState(null);
  const [photoLink, setPhotoLink] = useState(null);
  const [postalCode, setPostalCode] = useState(null);  
  const [state, setState] = useState(null);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState(null);

  const context = useContext(AuthContext);
  const token = context.authTokens;

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
            firstName,
            lastName,
            gender,
            latitude,
            longitude,
            name: username,
            phone,
            photoLink,
            postalCode,
            state
          },
        } = data;

        setCity(city);
        setCountry(country);
        setFullName(firstName + " " + lastName);
        setGender(gender);
        setLatitude(latitude);
        setLongitude(longitude);
        setPhone(phone);
        setPhotoLink(photoLink);
        setPostalCode(postalCode);
        setState(state);
        setUsername(username);
      }
    }
    getUserProfile();
  }, [userId]);

  return(
    <>
      <Grid.Row>
        <ProfilePhotoForm
          colWidth={8}
          formTitle={"Current Photograph"}
          profilePhotoBtnContent={"Upload Profile Photo"}
          photoLink={photoLink}
          userId={userId}
        />
      </Grid.Row>
      <Grid.Row>
        <FormInput
          icon={"user"}
          inputValue={username}
          name={"name"}
          placeholder={"User Name"}
        />
      </Grid.Row>
      <Grid.Row>
      <ProfileRequiredForm
          colWidth={8}
          formTitle={"My Profile"}
        />
      </Grid.Row>
      <Grid.Row>
        <FormInput
          icon={"phone"}
          inputValue={phone}
          name={"phone"}
          placeholder={"Phone Number"}
        />
      </Grid.Row>
      <Grid.Row>
        <FormInput
          icon={"map pin"}
          inputValue={city}
          name={"city"}
          placeholder={"City"}
        />
      </Grid.Row>
      <Grid.Row>
        <FormInput
          icon={"map pin"}
          inputValue={state}
          name={"state"}
          placeholder={"State"}
        />
      </Grid.Row>
      <Grid.Row>
        <FormInput
          icon={"flag"}
          inputValue={country}
          name={"country"}
          placeholder={"Country"}
        />
      </Grid.Row>
      <Grid.Row>
        <FormInput
          icon={"map pin"}
          inputValue={postalCode}
          name={"postalcode"}
          placeholder={"Postal Code"}
        />
      </Grid.Row>
    </>
  );
}

const FormInput = props => {
  const { icon, inputValue, name, placeholder } = props;

  const [value, setValue] = useState("");

  useEffect(() =>{
    if (inputValue) {
      setValue(inputValue);
    }
  }, [inputValue])

  return(
    <Form
      size="large"
    >
      <Form.Input
        className="fluid"
        icon={icon}
        iconPosition="left"
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={e => {
          setValue(e.target.value)
        }}
      />
    </Form>
  );
}

export default ProfileFullForm;
