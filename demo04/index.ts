import express from 'express';
import path from 'path';
import apiOstoksetRouter from './routes/apiOstokset';
import virhekasittelija from './errors/virhekasittelija';

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3004;

app.use(express.static(path.resolve(__dirname, "public")));

app.use("/api/ostokset", apiOstoksetRouter);

// middleware
app.use(virhekasittelija);

// tämä, jos menee virheenkäsittelijän läpi, eli se ei voi toteutua tuolla omassa virheidenkäsittelijässä
app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {

    // onko vastauksen otsikot lähetetty
    // jos ei, niin sitten voidaan olettaa, että 404 virhe (not found)
    // eli nyt ei lähetä sitä expressin omaa html virhettä, joka voisi olla ongelmallinen front endissä
    // eli se meni tuon /api/ostokset ohi, koska se ei ollut se, eikä jäänyt nextiin eli virhekäsittelijään, niin se tuli nyt tänne
    if (!res.headersSent) {
        res.status(404).json({ viesti : "Virheellinen reitti"});
    }

    next();
});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi porttiin : ${portti}`);    

});