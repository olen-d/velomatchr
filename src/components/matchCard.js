import React, { useContext, useState } from "react"

import {
  Button,
  Grid,
  Header,
  Icon
 } from "semantic-ui-react";

 import { useMatches } from "../context/matchesContext";

 const MatchCard = props => {
  const { requesterId, addresseeId, firstName, lastName, photoLink, city, state, createdAt, positiveStatus, negativeStatus } = props;
  const { matches, setMatches } = useMatches();

  const pla = photoLink.split("\\");
  pla.shift();
  const pl = pla.join("/");
  const [isError, setIsError] = useState(false);

  const postAction = (status) => {
    status = parseInt(status);
    // TODO: Need to update context...
    const actionData = {
      requesterId,
      addresseeId,
      status,
      actionUserId: requesterId,
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/relationships/status/update`, {
      method: "put",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(actionData)
    }).then(response => {
      return response.json();
    }).then(data => {
      if(data[1] !== 2)
        {
          // Something went horribly wrong
        } else {
          // Find the addressee in the list of matches
          const addresseeIndex = matches.map(item => {return item.addresseeId}).indexOf(addresseeId);
          console.log("matchCard.js - INDEX:\n", addresseeIndex);
          // Change the status as appropriate
          matches[addresseeIndex].status = status
          setMatches(matches);
        }
    }).catch(error => {
        setIsError(true);
    });
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
            onClick={() => postAction(positiveStatus)}
          >
          </Button>
          <Button
            type="button"
            size="small"
            icon="ban"
            content="Decline"
            onClick={() => postAction(negativeStatus)}
          >
          </Button>
        </Button.Group>
      </div>
    </>
  )

 }

 export default MatchCard;

