import React, { useState } from "react";
import PropTypes from "prop-types";

import { Redirect } from "react-router-dom";

import { useAuth } from "../context/authContext";
import { useMatches } from "../context/matchesContext";

import AddMatchButton from "./addMatchButton";
import BlockUserButton from "./blockUserButton";
import DeclineMatchButton from "./declineMatchButton";
import EmailMatchButton from "./emailMatchButton";
import ErrorContainer from "./errorContainer";
import UnfriendMatchButton from "./unfriendMatchButton";

import * as auth from "./auth";

const MatchCard = props => {
  const {
    status,
    requesterId,
    addresseeId,
    firstName,
    lastName,
    photoLink,
    city,
    stateCode,
    createdAt,
    isEmailMatchDisabled
  } = props;

  const { accessToken, setAccessToken } = useAuth();

  const { matches, setMatches } = useMatches();

  let pl = null;

  if(photoLink) {
    const slash = photoLink.indexOf("/");

    const pub = slash === -1 ? "public\\" : "public/";
    pl = photoLink.replace(pub, "")
  }

  const [executeRedirect, setExecuteRedirect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isErrorHeader, setIsErrorHeader] = useState(null);
  const [isErrorMessage, setIsErrorMessage] = useState(null);
  const [redirectURI, setRedirectURI] = useState(null);

  const postAction = async (action, value) => {
    const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, requesterId);
    if (isNewAccessToken) { setAccessToken(token); }

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
        if (data.status !== 200)
          {
            setIsError(true);
            setIsErrorHeader("Realtionship Not Updated");
            setIsErrorMessage(data.message);
          } else {
            setIsError(false);
            // Find the addressee in the list of matches
            const { matchesResult } = matches;
            const addresseeIndex = matchesResult.map(item => {return item.addresseeId}).indexOf(addresseeId);
            // Change the status as appropriate
            matchesResult[addresseeIndex].status = status
            setMatches({ matchesResult });
          }
      }).catch(error => {
        console.log("ERROR:", error)
          setIsError(true);
          setIsErrorHeader("Network Error");
          setIsErrorMessage("Something went wrong when fetching data from the server. Please try again later.");
      });
    } else if(action === "composeEmail") {
      setRedirectURI(`/email/compose/${addresseeId}`);
      setExecuteRedirect(true);
    }
  }

  return(
    <>
      { executeRedirect ? <Redirect to={`${redirectURI}`} /> : null }
      <ErrorContainer
        header={isErrorHeader}
        message={isErrorMessage}
        show={isError}
      />
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
      <div className="match-card-actions">
        { status === 0 && <><AddMatchButton status={status} postAction={postAction}/><DeclineMatchButton postAction={postAction}/></> }
        { status === 1 && <><AddMatchButton status={status} postAction={postAction}/><DeclineMatchButton postAction={postAction}/></> }
        { status === 2 && <><EmailMatchButton isEmailMatchDisabled={isEmailMatchDisabled} postAction={postAction} /><UnfriendMatchButton postAction={postAction}/></> }
        <BlockUserButton
          postAction={postAction}
        />
      </div>
    </>
  )
}

MatchCard.defaultProps = {
  status: 0,
  requesterId: -99,
  addresseeId: -99,
  firstName: "John",
  lastName: "Doe",
  photoLink: "",
  city: "New York",
  stateCode: "NY",
  createdAt: "March 2019",
}

const { number, string } = PropTypes;

MatchCard.propTypes = {
  status: number,
  requesterId: number,
  addresseeId: number,
  firstName: string,
  lastName: string,
  photoLink: string,
  city: string,
  stateCode: string,
  createdAt: string,
}

export default MatchCard;
