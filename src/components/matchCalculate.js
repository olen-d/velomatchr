import React from "react";
import {
  useParams
} from "react-router-dom";

const MatchCalculate = () => {
  const { userid } = useParams();

  const urls = [
    `${process.env.REACT_APP_API_URL}/api/survey/user/${userid}`,
    `${process.env.REACT_APP_API_URL}/api/survey/except/${userid}`
  ];

  Promise.all(urls.map(url =>
    fetch(url)
    .then(response => {
      return response.ok ? Promise.resolve(response) : Promise.reject(new Error(response.statusText)); 
    })
    .then(response => {
      return response.json();
    })
    .catch(err => {
      // Do something about the error
      console.log("ERROR:\n", err);
    })
    )).then(data => {
      console.log("DATA:\n", data);
    });

  return(
    <div>
      Match Calculate!
      <p>
        {userid}
      </p>
    </div>
  );
}

export default MatchCalculate;
