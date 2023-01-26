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