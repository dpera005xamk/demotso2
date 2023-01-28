import express from 'express';
import path from 'path';
import apiOstoksetRouter from './routes/apiOstokset';
import virhekasittelija from './errors/virhekasittelija';

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3005;

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

// prisma asennus:
/**
 * npm install prisma --save-dev
 * sitten client
 * npm install @prisma/client
 * npx prisma init // eli kun se on package.jsonissa, niin sitä voi käyttää npx komennolla
 * sitten syntyi prisma kansio,
 * siellä on aluksi vain schema.prisma
 * lisäksi tuli juuren .env
 * asenna vs codessa prisma
 */