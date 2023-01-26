import express from 'express';
import path from 'path';
// tietomallit yleensä model/models kansiossa
import kayttajat, {Kayttaja} from './models/kayttajat';

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3002;

interface Kayttajatieto {
    id : number,
    nimi : string,
    sahkoposti : string,
    kayttajatunnus : string,
    rekisteroitymisPvm : string
 }

 interface Yhteystieto {
    id : number,
    nimi : string,
    sahkoposti : string
 }


app.use(express.static(path.resolve(__dirname, "public")));

// palauttaa vain yhteistiedon, jonka id täsmää
app.get("/yhteystiedot/:id", (req: express.Request, res : express.Response) : void => {

    // kun joskus ei löydy, niin undefinedi kanssa
    let yhteystieto : Yhteystieto | undefined = kayttajat.map((kayttaja : Kayttaja) => {
        // mappaa eka
        return {
            id : kayttaja.id,
            nimi : `${kayttaja.etunimi} ${kayttaja.sukunimi}`,
            sahkoposti : kayttaja.sahkoposti
        }
        // ja sitten etsii sen oikean
    }).find((yhteystieto : Yhteystieto) => yhteystieto.id === Number(req.params.id));

    if (yhteystieto) {
        // kannattaa käyttää json, jos lähetät jsonia
        res.json(yhteystieto);
    } else {
        res.json({virhe : `Käyttäjää id : ${req.params.id} ei löytynyt`});
    }
    

});

// palauttaa kaikki yhteystiedot
app.get("/yhteystiedot", (req: express.Request, res : express.Response) : void => {

    let yhteystiedot : Yhteystieto[] = kayttajat.map((kayttaja : Kayttaja) => {
        return {
            id : kayttaja.id,
            nimi : `${kayttaja.etunimi} ${kayttaja.sukunimi}`,
            sahkoposti : kayttaja.sahkoposti
        }
    });

    res.json(yhteystiedot);

});

app.get("/kayttajatiedot", (req: express.Request, res : express.Response) : void => {

    let kayttajatiedot : Kayttajatieto[] = kayttajat.map((kayttaja : Kayttaja) => {
        return {
            id : kayttaja.id,
            nimi : `${kayttaja.etunimi} ${kayttaja.sukunimi}`,
            sahkoposti : kayttaja.sahkoposti,
            kayttajatunnus : kayttaja.kayttajatunnus,
            rekisteroitymisPvm : kayttaja.rekisteroitymisPvm    
        }
    });

    if (typeof req.query.vuosi === "string") {
        // sieltä tulee esim. 2022, tai 2021, niin sieltä tulee sit vaan sinä vuonna rekisteröidyt
        kayttajatiedot = kayttajatiedot.filter((kayttajatieto : Kayttajatieto) => kayttajatieto.rekisteroitymisPvm.substring(0, 4) === req.query.vuosi);

    }

    res.json(kayttajatiedot);

});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi porttiin : ${portti}`);    

});