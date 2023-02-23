import express from 'express';
import path from 'path';
import apiOstoksetRouter from './routes/apiOstokset';
import virhekasittelija from './errors/virhekasittelija';
import cors from 'cors'; // muista installoida myös npm install @types/cors --save-dev

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3006;
                        // huom protokolla myös, esim. https tai http ja koko urli mukaan
                        // origin "*" olisi myös kaikki, tai ilman koko jsonia
                        // postmaniin ei vaikuta, koska postman toimii palvelemina itsekin, ja palvelimet saa jutella
                        // tosin sekin voidaan estää, mutta siitä lisää muilla tunneilla
app.use(cors({origin : "http://localhost:3000"})); // tämä kannattaa olla ensimmäinen middleware

app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {

    setTimeout(() => next(), 1000); // tällä tehdään sekunnin viive, niin saadaan sitä viivettä hallittua
                                    // vain demon vuoksi, että voi progress circleä tms. testata

});

app.use(express.static(path.resolve(__dirname, "public")));

app.use("/api/ostokset", apiOstoksetRouter);

app.use(virhekasittelija);

app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (!res.headersSent) {
        res.status(404).json({ viesti : "Virheellinen reitti"});
    }

    next();
});

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi porttiin : ${portti}`);    

});
/*
react ts:
npx create-react-app client --template typescript
mui:
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material @fontsource/roboto

*/