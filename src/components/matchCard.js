import React from "react"

import {
  Container,
  Grid,
  Header,
  Icon
 } from "semantic-ui-react";

 const matchesCard = props => {
  const { id, firstName, lastName, photoLink, city, state, createdAt } = props;
  const pla = photoLink.split("\\");
  pla.shift();
  const pl = pla.join("/");


  return(
    <>
      <div className="match-card-profile photo">
        <img src={pl} width="100px" height="auto" alt="cheese" />
      </div>
      <div className="match-card-full-name">
        {firstName} {lastName}
      </div>
      <div className="match-card-address">
        {city}, {state}
      </div>
      <div className="match-card-joined">
        Member Since: {createdAt}
      </div>
    </>
  )

 }

 export default matchesCard;

