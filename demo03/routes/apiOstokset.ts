import express from 'express';
import Ostoslista, { Ostos } from '../models/ostoslista';

const ostoslista : Ostoslista = new Ostoslista();

const apiOstoksetRouter : express.Router = express.Router();

// tämä tarvitaan, että voidaan ottaa bodyjä vastaan ja ne muutetaan jsoniksi
// tämän jälkeen req.body toimii
apiOstoksetRouter.use(express.json());

apiOstoksetRouter.delete("/:id", async (req : express.Request, res : express.Response) => {

    await ostoslista.poista(Number(req.params.id));

    res.json(ostoslista.haeKaikki());

});

// put muokkaa
apiOstoksetRouter.put("/:id", async (req : express.Request, res : express.Response) => {

    let muokattuOstos : Ostos = {
        id : req.body.id,
        tuote : req.body.tuote,
        poimittu : req.body.poimittu
    }

    await ostoslista.muokkaa(muokattuOstos, Number(req.params.id));

    res.json(ostoslista.haeKaikki());

});

/**
 * Miten tähän lähetetään postmanissa:
 * body välilehdellä: esim. valitse raw, JSON,
 * eli tää on json dataa, ei object, joka json tyyppistä, eli lainausmerkit propseihin
 * {
 *   "tuote" : "Omenoita",
 *   "poimittu" : false
 * }
 */
// post on hyvä olla async
apiOstoksetRouter.post("/", async (req : express.Request, res : express.Response) => {

    let uusiOstos : Ostos = {
                        id : 0,
                        tuote : req.body.tuote,
                        poimittu : req.body.poimittu
                    }

    await ostoslista.lisaa(uusiOstos);

    res.json(ostoslista.haeKaikki());

});

apiOstoksetRouter.get("/:id", (req : express.Request, res : express.Response) => {

    res.json(ostoslista.haeYksi(Number(req.params.id)));

});

apiOstoksetRouter.get("/", (req : express.Request, res : express.Response) => {

    res.json(ostoslista.haeKaikki());

});

export default apiOstoksetRouter;