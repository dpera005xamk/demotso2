import express from 'express';
import path from 'path';
import apiOstoksetRouter from './routes/apiOstokset';
import apiAuthRouter from './routes/apiAuth';
import virhekasittelija from './errors/virhekasittelija';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; // tämä, että saa .env toimimaan tähän

dotenv.config(); // tässä käyntiin

const app : express.Application = express();

const portti : number = Number(process.env.PORT);

const checkToken = (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {

        let token : string = req.headers.authorization!.split(" ")[1];

        // eli ilmeisesti nyt kun se tässä poimitaan se käyttäjä tosta tokenista
        // niin jos käsitin oikein, niin seuraavissakin reiteissä se voidaan poimia sieltä
                                                // kannattaa ympyröidä stringiksi
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
Kun tietokanta ja taulukot on tehty palvelin ohjelmaan esim. mssms, atlas tai phpMyAdminiin, niin ensiksi prisma tehdään 
uusiksi eli npx prisma init.
- sitten tehdään schema, sinne prisma kansioon, eli vaihdat vaan ton providerin ja sitten ton envin
- provider "mysql" (maria db on mysql:n avoin versio)
- .env tiedostoon sitten se yhteys, eli esim. DATABASE_URL="mysql://tunnus:salasana@localhost:3306/ostoslista"
- eli tuo tunnus:salasana on se mysql tunnukset, millä sinne on kirjauduttu.
- sitten tehdään käyttis ja salasana. palvelimen asetuksissa: user accounts. täällä tee käyttäjä ja salasana
- host name: local (tai any host). ohjelmassa voi olla vaikka generatori passulle.
- sitten oikeudet, eli select, insert update ja delete varmaan mitä tämmönen käyttäjä voisi tehdä
- mutta jos tehdään prismasta, niin sitten create alter drop jne...
- eli nyt kun ne createt jne tehty jo ohjelmassa, niin nuo pitäisi riittää
- eli nyt saat ne tohon urliin
- sit prisma db pull, niin haetaan se tuolta, mitä määritettiin
- siinä tuli modelit mukaan kätevästi
- sitten vielä prisma generate, niin generoi sen prisma clientin uudelleen
- katso luoAvain.js, miten kunnon pitkä random stringi
- .env pitää muistaa sitten laittaa tonne .gitignoreen
*/