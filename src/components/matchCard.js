import React, { useState } from "react";
import PropTypes from "prop-types";

import { Redirect } from "react-router-dom";

import { useAuth } from "../context/authContext";
import { useMatches } from "../context/matchesContext";

import { Icon, Header, Button } from "semantic-ui-react";

import AddMatchButton from "./addMatchButton";
import BlockUserButton from "./blockUserButton";
import DeclineMatchButton from "./declineMatchButton";
import EmailMatchButton from "./emailMatchButton";
import ErrorContainer from "./errorContainer";
import UnfriendMatchButton from "./unfriendMatchButton";

import * as auth from "./auth";

import "./matchCard.css";

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
    <div className="match-card">
      { executeRedirect ? <Redirect to={`${redirectURI}`} /> : null }
      <ErrorContainer
        header={isErrorHeader}
        message={isErrorMessage}
        show={isError}
      />
      <div className="match-card-profile-photo">
        { photoLink ? ( <img src={pl} width="100px" height="auto" alt={firstName} /> ) : ( <Icon color="grey" name="user circle" size="big" /> ) }
      </div>
      <div className="match-card-full-name">
        <Header as="h3" color="black">{firstName} {lastName}</Header>
      </div>


      <div className="match-card-address">
        {city}, {stateCode}
      </div>
      <div className="match-card-joined">
        Member Since: {createdAt}
      </div>
      <div className="match-card-actions">
        <div className="match-card-button-row">
          <Button.Group widths={2}>
            { status === 0 && <><AddMatchButton content="Request" status={status} postAction={postAction}/><DeclineMatchButton postAction={postAction}/></> }
            { status === 1 && <><AddMatchButton content="Approve" status={status} postAction={postAction}/><DeclineMatchButton postAction={postAction}/></> }
            { status === 2 && <><EmailMatchButton isEmailMatchDisabled={isEmailMatchDisabled} postAction={postAction} /><UnfriendMatchButton postAction={postAction}/></> }
          </Button.Group>
        </div>
        { status === 2 &&
          <BlockUserButton
            postAction={postAction}
          />
        }
      </div>
    </div>
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
