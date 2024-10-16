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
Herokuun julkaisu:
1. tarvitaan tsconfig tiedosto, eli sen perusteella määritellään mitkä käännetään javascriptiksi.
npx tsc -init. se tekee tsconfig.json
- target määrittelee version, eli es2016 on ok
- halutaan kännös omaan kansioon
eli 50 rivillä: outdir: oudir": "./dist",
voi olla vaikka myös build tai lib kanssa, mutta dist ok "distribution"
loppuun määritellään mitä ei käännetä:
koska siellä on client, jossa on omat käännökset ja node_modules ei käännetä:
,
},
  "exclude": ["node_modules", "client"]
2. sitten käynnistetään kääntö: npx tsc
- sillä syntyy se dist kansio, jossa on tämä käännettynä javascriptiksi.

selvyyden vuoksi tehdään dist kansiosta oma projekti, eli oma repo, joka toimii julkaisuun repositorynä
eli uusi repo sinne ja kopsaa git urli ja avaa uusi code, johon cloneet
kopsaa dist kansion sisältö tähän juureen. eli vaan sisältö
nyt kun on muutaki ku ts tiedostoja, eli kopsaa .env, packake.json, .gitignore
toki .env ja node_modules ettei ne mene, eli laita ne git ignoreen.
package.json niin poistellaan riippuvuuksia:
kaikki @types
samoin ts-node ja typescript ja nodemon pois
jätä prisma sinne devDepenciesiin, muita ei.
startti scripti on sitten node index.js.
voit nimetä namen vaikkapa myös.
tee build scripti, scirpteseihi:
"build": "npm install && npx prisma init --datasource-provider mysql && npx prisma db pull && npx prisma generate"
tallenna, sitten avaa terminaali:
npm run build, ainoastaan start scipti toimii ilman "run" sanaa
npm start, niin pitäisi lähteä käyntiin, mutta clienttiä vielä ei ole, joten, sammuta control+c
eli tee reactiin buildi myös, eli palaa vanhaan koodiin
siellä index.html, vaihda title kuntoon ja muut vastaavat, jos app-komponentissä jotain
npm run build
kopioi build kansio tohon uuteen
sitten vaihda build kansion nimi "public", tai voit toki vaihtaa sen index.js public=>build...
katso se, ettei ole localhosteja sitten, vaan proxyn kautta pitää olla sitten ne osotteet clientissä
sitten käyntiin vaan... npm start
tämä on se kokonaisuus, jonka voi laittaa herokuun, eli eka laita tämä githubiin...
tee tunnukset jne. 

new, nimi, eli se on yksilöivä, vaikka joku euroopan alue, ei tarvii pipelineä laittaa,
create app.
tarvitaan tietokanta:
resources:
add-ons: ota heroku Postgres
, katso, että free
submit order form ja se on sitten siinä ja siitä voi clikkailla, jos haluaa
sit deploy:
siitä vaikka github, siihen pitää antaa oikeudet githubiin, ja siihen sitten repon nimi, kun yhteys kunnossa.
voi valita automaattisen päivityksen, jos main päivittyy, tai vaikka se manual deploy
siitä sit käynnistä deploy.
pari virhettä tulee näillä, eli nämä ovat yleisiä:
ei ole määritelty noden versiota ja buildiscripti vääränlainen eli:
package jsoniin, käännetyssä: 
,
"engines": {
    "node": "16.x"
}
sit buildiä:
"build": "npm install && npx prisma db push && npx prisma generate"
eli pull vaihetaan pushiksi ja koska onki siellä postgre, eikä mysql
eli init vaihde pois ja sitten vaihda schemassa, että provider on "postgresql"
... eli nyt ei toimi meidän päässä, mutta tallenna.
sitten pushaa muutokset
heroku työkaluun:
tee deploy:
tuli kuntoon
tosin tietokanta on nyt tyhjä, eli et varmaan pääse sisään, jos oli login sovellus
tee seedaus: 
tee seed.js tonne prismakansioon.
käytä valmista koodia prisman dokumentaatiosta, demossa 10 on seedaus ohjeet ja seed.js
package jasoniin: 
"prisma": {
    "seed": "node prisma/seed.js"  ... huom js. ei ts
}
sitten lisää buildiin: npx prisma db seed, ennen generatea:
vie sit githubiin ja tee herokussa deploy uudestaan

sitten .env pitäisi saada
settings kohdassa on env kohta "config vars" ja sinne varmaan tuliki jo database_URl, kun ollaan laitettu pushi tms
sinne esim. access token key
mutta pitäisi voida jo rueta käyttämään näillä
 : 
*/