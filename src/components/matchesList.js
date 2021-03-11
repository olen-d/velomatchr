import React, { useEffect, useState } from "react"
import PropTypes from "prop-types";

import * as auth from "./auth";

import { useMatches } from "../context/matchesContext";
import { useAuth } from "../context/authContext";

import MatchCard from "./matchCard";

import "./matchesList.css";

const MatchesList = props => {
  const { showNoMatches, status } = props;

  const [matchesFilteredByStatus, setMatchesFilteredByStatus] = useState([]);
  const [noMatches, setNoMatches] = useState(null);
  const [userId, setUserId] = useState(null);

  // Get items from context
  const { accessToken, setAccessToken } = useAuth();
  const { matches, setMatches } = useMatches();

  const { user } = auth.getUserInfo(accessToken);

  // Styles
  const headlineStyle = {
    marginBottom: "2rem",
    fontSize: "1.5rem",
    fontWeight: 500,
    color: "#f2711c"
  };

  // Set up the action buttons
  let headline="";

  switch(status) {
    case 0:
      headline = "Potential Matches";
      break;
    case 1:
      headline="New Buddy Requests";
      break;
    case 2:
      headline="Buddies";
      break;
    default:
  }

  useEffect(() => { setUserId(user) }, [user])

  // Fetch Matches Hook
  useEffect(() => {
    setMatches({isLoading: true});

    if (userId) {
      (async () => {
        try {
          const { isNewAccessToken, accessToken: token } = await auth.checkAccessTokenExpiration(accessToken, userId);
          if (isNewAccessToken) { setAccessToken(token); }
  
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/relationships/user/id/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
  
          const json = response.ok ? await response.json() : null; 
          json ? setMatches({ error: false, isLoading: false, matchesResult: json }) : setMatches({ error: true, isLoading: false, matchesResult: [] });
        } catch(error) {
          setMatches({ error, matchesResult: [], isLoading: false });;
        }
      })()
    }
  }, [accessToken, setAccessToken, setMatches, userId]);

  useEffect(() => {
    const { error, matchesResult } = matches;
    let mounted = true;


    if (error) {
      // TODO: Do something about the error
    } else {
      if(Array.isArray(matchesResult)) {
        let filteredMatches = [];

        if (status === 0) {
          filteredMatches = matchesResult.filter(
            match => match.status === status && match.matchScore < 20
          );

        } else if (status === 1) {
          filteredMatches = matchesResult.filter(
            match => match.status === status && match.actionUserId !== userId && match.matchScore < 20
          );
        } else if (status === 2) {
          filteredMatches = matchesResult.filter(
            match => match.status === status 
          );
        }
        switch(status) {
          case 0:
            setNoMatches("No potential matches were found. ");
            break;
          case 1:
            setNoMatches("No buddy requests were found. ");
            break;
          case 2:
            setNoMatches("No buddies were found. "); 
            break;
          default:
            setNoMatches("No potential matches were found. ")
            break;
        }
        const returnedMatches = filteredMatches.length > 10 && status !== 2 ? filteredMatches.slice(0, 10) : filteredMatches;
        if (mounted) {
          setMatchesFilteredByStatus(returnedMatches);
        }
      };
    }
    return ()=> mounted = false;
  }, [matches, status, userId]);

  if (matchesFilteredByStatus.length === 0)
  {
    if (showNoMatches) {
      return(
        <div className="matches-list">
          <div style={headlineStyle}>
            {headline}
          </div>
          <div className="no-matches-found">
            {noMatches}
          </div>
        </div>
      );
    } else {
      return null;
    }
  } else {
    if (matches.isLoading) {
      return(
        <div>
          Loading matches..
        </div>
      )
    } else {
      return(
        <div className="matches-list">
          <div style={headlineStyle}>
            {headline}
          </div>
          {matchesFilteredByStatus.map(({ id, addressee: { id: addresseeId, firstName, lastName, isEmailVerified, photoLink, city, stateCode, createdAt}, }) => (
            <div className="match-card" key={id}>
              <MatchCard
                status={status}
                requesterId={userId}
                addresseeId={addresseeId}
                firstName={firstName}
                lastName={lastName ? lastName.substring(0,1) + "." : "N."}
                photoLink={photoLink}
                city={city}
                stateCode={stateCode}
                createdAt={new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long"
                }).format(new Date(createdAt))}
                isEmailMatchDisabled={status === 2 && isEmailVerified === 0 ? true : false}
              />
            </div>
          ))}
        </div>
      )
    }
  }
}

MatchesList.defaultProps = {
  showNoMatches: true,
  status: -99
};

const { bool, number } = PropTypes;

MatchesList.propTypes = {
  showNoMatches: bool,
  status: number
}

export default MatchesList;

 // Loading spinner
 // Check for matches
 // If user has no matches, run the magical mystery matching algorithm
 // Return the list of matches

 // Match flow
 // Run matches when user completes survey
 // Present list of potential matches
 // User declines or approves match
 // Declined matches get a status code of decline and never match in the future
 // Approved match sends a friend request to the addressee
