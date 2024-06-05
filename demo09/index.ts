import express from 'express';
import path from 'path';
import apiOstoksetRouter from './routes/apiOstokset';
import apiAuthRouter from './routes/apiAuth';
import virhekasittelija from './errors/virhekasittelija';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app : express.Application = express();

const portti : number = Number(process.env.PORT);

const checkToken = (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {

        let token : string = req.headers.authorization!.split(" ")[1];

        res.locals.kayttaja = jwt.verify(token, String(process.env.ACCESS_TOKEN_KEY));

        next();

    } catch (e: any) {
        res.status(401).json({});
    }

}

app.use(express.static(path.resolve(__dirname, "public")));

app.use("/api/auth", apiAuthRouter);

app.use("/api/ostokset", checkToken, apiOstoksetRouter);

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
ensiksi tietokanta:
avaa xampp, siellä mysql ja apache käyntiin.
sitte aukeaa localhost:80 ja siellä localhost/phpmyadmin
siellä create database, create table. myös sql koodi toimii

*/