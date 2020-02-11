const newRandomCode = digits => {
  let randomCode = "";
  console.log(digits);
  for(let i = 0; i < digits; i++) {
    randomCode += Math.floor(Math.random() * 9) + 1;
    console.log(randomCode[i]);
  }
  console.log("LENGTH:", randomCode.length);
}

module.exports = {
  newRandomCode
}