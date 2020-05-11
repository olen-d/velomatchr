const stateCode = "GA";
const countryCode = "US";

const fetch = require("node-fetch");

Promise.all([
    fetch(`http://localhost:5000/api/states/code/${stateCode}`),
    fetch(`http://localhost:5000/api/countries/alphatwo/${countryCode}`)
  ])
    .then(responses => {
      // console.log(responsea, responseb);
      return responses.map(response => {
        return response.json();
      });
    })
    .then(data => {
console.log(data.typeOf);
      // data.then(cheese => { console.log(cheese)});
    })
      // responsea.json().then(result => {
      //   console.log(result)
      // });
      // responseb.json().then(result => {
      //   console.log(result);
      // });
    // })
    .catch(error => {
      console.log("ERROR: ", error);
    });