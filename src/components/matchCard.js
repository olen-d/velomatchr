import React from "react"

import {
  Button,
  Grid,
  Header,
  Icon
 } from "semantic-ui-react";

 const matchesCard = props => {
  const { id, firstName, lastName, photoLink, city, state, createdAt } = props;
  const pla = photoLink.split("\\");
  pla.shift();
  const pl = pla.join("/");

  const postAdd = () => {
    //
  }

  const postDecline = () => {
    //
  }

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
      <div className='match-card-actions'>
        <Button.Group widths="2" color="yellow">
          <Button
            type="button"
            size="small"
            icon="user plus"
            content="Add Buddy"
            onClick={postAdd}
          >
          </Button>
          <Button
            type="button"
            size="small"
            icon="ban"
            content="Decline"
            onClick={postDecline}
          >
          </Button>
        </Button.Group>
      </div>
    </>
  )

 }

 export default matchesCard;

