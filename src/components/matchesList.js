import React, { useEffect, useState } from "react"

import auth from "./auth";

// import {
//   Container,
//   Grid,
//   Header,
//   Icon
//  } from "semantic-ui-react";

 import { useMatches } from "../context/matchesContext";
 import { useAuth } from "../context/authContext";

 import MatchCard from "./matchCard";

 const MatchesList = props => {
  const { status } = props;

  const [userId, setUserId] = useState(null);
  const [matchesFilteredByStatus, setMatchesFilteredByStatus] = useState([]);
  const [noMatches, setNoMatches] = useState(null);

  // Get items from context
  const { accessToken, setAccessToken } = useAuth();
  const { matches, setMatches } = useMatches();

  const { user } = auth.getUserInfo(accessToken);

  // Set up the action buttons
  let leftBtnIcon = "";
  let leftBtnContent = "";
  let leftBtnAction = "";
  let leftBtnValue = 0;
  let rightBtnIcon = "";
  let rightBtnContent = "";
  let rightBtnAction = "";
  let rightBtnValue = 0;

  switch(status) {
    case 0:
    case 1:
      leftBtnIcon = "user plus";
      leftBtnContent = "Add Buddy";
      leftBtnAction = "updateStatus";
      leftBtnValue = status + 1;
      rightBtnIcon = "ban";
      rightBtnContent = "Decline";
      rightBtnAction = "updateStatus";
      rightBtnValue = 3;
      break;
    case 2:
      leftBtnIcon = "envelope";
      leftBtnContent = "Email Buddy";
      leftBtnAction = "composeEmail"
      leftBtnValue = 0; // Currently not used
      rightBtnIcon = "minus circle";
      rightBtnContent = "Unfriend";
      rightBtnAction = "updateStatus";
      rightBtnValue = 3;
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
          const { isNewAccessToken, newAccessToken } = await auth.checkAccessTokenExpiration(accessToken, userId);
          if (isNewAccessToken) { setAccessToken(newAccessToken); }
  
          const response = await fetch(`${process.env.REACT_APP_API_URL}/api/relationships/user/id/${userId}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          });
  
          const json = response.ok ? await response.json() : setMatches({ error: response.statusText, matchesResult: [], isLoading: false }); 
          setMatches({ matchesResult: json, isLoading: false });
        } catch(error) {
          setMatches({ error, matchesResult: [], isLoading: false });;
        }
      })()
    }
  }, [accessToken, setAccessToken, setMatches, userId]);

  useEffect(() => {
    const { error, matchesResult } = matches;
    let mounted = true;


    if(error) {
      // TODO: Do something about the error
    } else {
      if(Array.isArray(matchesResult) && matchesResult.length) {
        let filteredMatches = [];

        if (status === 0) {
          filteredMatches = matchesResult.filter(
            match => match.status === status && match.matchScore < 20
          );

        } else if (status === 1) {
          filteredMatches = matchesResult.filter(
            match => match.status === status && match.actionUserId !== userId && match.matchScore < 20
          );
          setNoMatches("No buddy requests were found. ");
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
    return(
      <div className="no-matches-found">
        {noMatches}
      </div>
    )
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
          {matchesFilteredByStatus.map(({ id, addressee: { id: addresseeId, firstName, lastName, isEmailVerified, photoLink, city, stateCode, createdAt}, }) => (
            <div className="match-card" key={id}>
              <MatchCard
                requesterId={userId}
                addresseeId={addresseeId}
                firstName={firstName}
                lastName={lastName.substring(0,1) + "."}
                photoLink={photoLink}
                city={city}
                stateCode={stateCode}
                createdAt={new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long"
                }).format(new Date(createdAt))}
                leftBtnDisabled={status === 2 && isEmailVerified === 0 ? true : false}
                leftBtnIcon={leftBtnIcon}
                leftBtnContent={leftBtnContent}
                leftBtnAction={leftBtnAction}
                leftBtnValue={leftBtnValue}
                rightBtnIcon={rightBtnIcon}
                rightBtnContent={rightBtnContent}
                rightBtnAction={rightBtnAction}
                rightBtnValue={rightBtnValue}
              />
            </div>
          ))}
        </div>
      )
    }
  }
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
