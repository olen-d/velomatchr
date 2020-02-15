const newRandomCode = digits => {
  let randomCode = "";
  for(let i = 0; i < digits; i++) {
    randomCode += Math.floor(Math.random() * 10);
  }
  return randomCode;
}

module.exports = {
  newRandomCode
}
