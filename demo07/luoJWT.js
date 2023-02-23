let token = require("jsonwebtoken").sign({}, "SuuriSalaisuus!!!");
                                    // payload, eli ei käytetä vielä ekaa vielä. ja tähän toiseen salaisuus
console.log(token);

// sen takia .js kun käytetään requirea

// signillä kirjoitetaan uusi

// verifyllä tarkistetaan, että on mikä pitää

// sit käynnistät tän eli: node luoJWT.js ja kopioi se