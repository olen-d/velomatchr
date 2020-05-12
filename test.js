const stateCode = "GA";
const countryCode = "US";

const fetch = require("node-fetch");

Promise.all([
    fetch(`http://localhost:5000/api/states/code/${stateCode}`),
    fetch(`http://localhost:5000/api/countries/alphatwo/${countryCode}`)
  ])
  .then(responses => {
    const data = responses.map(response => response.json());
    return Promise.all(data);
  })
  .then(data => {
    const [ { state: { name: stateName }, },  { country: { name: countryName }, } ] = data;
    console.log(stateName, countryName);
  })
  .catch(error => {
    console.log("ERROR: ", error);
  });
