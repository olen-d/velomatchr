import React, { useContext, useState } from "react"

import {
  Button,
  Grid,
  Header,
  Icon
 } from "semantic-ui-react";

 import { useMatched } from "../context/matchedContext";

 const MatchedCard = props => {
  const { requesterId, addresseeId, firstName, lastName, photoLink, city, state, createdAt, negativeStatus } = props;
  const { matches, setMatches } = useMatched();

  const pla = photoLink.split("\\");
  pla.shift();
  const pl = pla.join("/");
  const [isError, setIsError] = useState(false);

  const composeEmail = recipient => {
      //
      console.log("matchedCard.js - ComposeEmail", recipient, negativeStatus);
  }

  const postAction = (status) => {

    status = parseInt(status);
    // TODO: Need to update context based on status...
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
            icon="envelope"
            content="Email Buddy"
            onClick={() => composeEmail(addresseeId)}
          >
          </Button>
          <Button
            type="button"
            size="small"
            icon="minus circle"
            content="Unfriend"
            onClick={() => postAction(negativeStatus)}
          >
          </Button>
        </Button.Group>
      </div>
    </>
  )
 }

 export default MatchedCard;
