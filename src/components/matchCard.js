import React, { useContext, useState } from "react"

import {
  Button
 } from "semantic-ui-react";

 import { AuthContext } from "../context/authContext";
 import { useMatches } from "../context/matchesContext";

 const MatchCard = props => {
  const {
    requesterId,
    addresseeId,
    firstName,
    lastName,
    photoLink,
    city,
    stateCode,
    createdAt,
    leftBtnIcon,
    leftBtnContent,
    leftBtnAction,
    leftBtnValue,
    rightBtnIcon,
    rightBtnContent,
    rightBtnAction,
    rightBtnValue
  } = props;
  
  const context = useContext(AuthContext);
  const {authTokens: token } = context;

  const { matches, setMatches } = useMatches();

  let pl = null;

  if(photoLink) {
    let pub = null;
    const slash = photoLink.indexOf("/");

    slash === -1 ? pub = "public\\" : pub = "public/";
    pl = photoLink.replace(pub, "")
  }

  const [isError, setIsError] = useState(false);

  const postAction = (action, value) => {
    if(action === "updateStatus") {
      const status = parseInt(value);
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(actionData)
      }).then(response => {
        return response.json();
      }).then(data => {
        if(data[1] !== 2)
          {
            // Something went horribly wrong
            // TODO: Deal with the error
          } else {
            // Find the addressee in the list of matches
            const { matchesResult } = matches;
            const addresseeIndex = matchesResult.map(item => {return item.addresseeId}).indexOf(addresseeId);
            // Change the status as appropriate
            matchesResult[addresseeIndex].status = status
            setMatches({ matchesResult });
          }
      }).catch(error => {
          setIsError(true);
      });
    } else if(action === "composeEmail") {
      // const addressee = parseInt(value);
    }
  }

  return(
    <>
      <div className="match-card-profile photo">
        { photoLink ? ( <img src={pl} width="100px" height="auto" alt={firstName} /> ) : ( <i className="fas fa-user-circle"></i> ) }
      </div>
      <div className="match-card-full-name">
        {firstName} {lastName}
      </div>
      <div className="match-card-address">
        {city}, {stateCode}
      </div>
      <div className="match-card-joined">
        Member Since: {createdAt}
      </div>
      <div className='match-card-actions'>
        <Button
          type="button"
          size="tiny"
          color="yellow"
          icon={leftBtnIcon}
          content={leftBtnContent}
          onClick={() => postAction(leftBtnAction, leftBtnValue)}
        >
        </Button>
        <Button
          type="button"
          size="tiny"
          color="yellow"
          icon={rightBtnIcon}
          content={rightBtnContent}
          onClick={() => postAction(rightBtnAction, rightBtnValue)}
        >
        </Button>
      </div>
    </>
  )
 }

 MatchCard.defaultProps = {
  requesterId: -99,
  addresseeId: -99,
  firstName: "John",
  lastName: "Doe",
  photoLink: "",
  city: "New York",
  stateCode: "NY",
  createdAt: "March 2019",
  leftBtnIcon: "",
  leftBtnContent: "",
  leftBtnAction: "",
  leftBtnValue: 0,
  rightBtnIcon: "",
  rightBtnContent: "",
  rightBtnAction: "",
  rightBtnValue: 0
}

 export default MatchCard;
