import express from 'express';
import path from 'path'; 

const app : express.Application = express();

// hyvä olla isompi ku 3000, ettei tule konflikteja
const portti : number = Number(process.env.PORT) || 3001;

// path resolvessa __dirname tarkottaa työhakemistoa ja siellä public
// app.use toimii kaikkiin pyyntöihin esim. get, put jne
// staattisten tiedostojen määrittely
// public yleensä se jossa on staattiset tiedostot
// path.resolvesta tulee kauttaviivat sun muut, käyttöjärjestelmän mukaan
// voi jakaa staattisia tiedostoja, clientille.
// esim. jos siellä index.html, niin se avaa, kun joku menee 3001 porttiin.
app.use(express.static(path.resolve(__dirname, "public")));

app.get("/heippa", (req: express.Request, res : express.Response) : void => {

    let nimi : string = "";

    if (typeof req.query.nimi === "string") {
        nimi = req.query.nimi;
    } else {
        nimi = "tuntematon";
    }

    res.send(`<h1>Heippa, ${nimi}!</h1>`); 
    // res.sendFile, voisi lähettää esim. html tiedostonc

});
  // void tarkottaa, että ei palauta mitään.
app.get("/moikka", (req: express.Request, res : express.Response) : void => {

    res.send("<h1>Moikka!</h1>");

});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi porttiin : ${portti}`);    

});

// asennus ohjeet, jolla saa noden ts:llä käyntiin:
/**
 * npn init -y
 * kääntö ts:stä js:
 * npm install typescript //... tuo tuen tähän projektiin
 * npm install typescript -g //... yleisesti
 * 
 * koska paikallisena:
 * npx tsc index.ts // tämä käänsi sen js:si... mutta ei ehkä käytetä, koska:
 * otetaan mielummin tämä, niin ei tarvitse kokoajan käännellä:
 * npm install ts-node --save-dev
 * npm install @types/node // pikku note: "npm install @types/node if it's a Node/terminal app, or use "lib": ["dom"] if it's a browser app"
 * sitten nodemon, niin kätevästi päivittelee devauksen ajan:
 * install nodemon --save-dev
 * taitaa tarvita myös: npm i --save-dev @types/express
 * npx nodemon index.ts
 * tähän hyvä tehdä startti scripti: "start" : "npx nodemon index.ts", niin npm start riittää
 * 
 * yleensä jos otat vaikka clonena jonkun pohjan, niin sitten vaan "npm install" riittänee
 */