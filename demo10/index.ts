import express from 'express';
import apiBlogitekstitRouter from './routes/apiBlogitekstit';
import path from 'path';
import virhekasittelija from './errors/virhekasittelija';
import dotenv from 'dotenv';

dotenv.config();

const app : express.Application = express();

app.use(express.static(path.resolve(__dirname, "public")));

app.use("/api/blogitekstit", apiBlogitekstitRouter);

app.use(virhekasittelija);

app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {

    if (!res.headersSent) {
        res.status(404).json({ viesti : "Virheellinen reitti"});
    }

    next();
});

app.listen(Number(process.env.PORT), () => {

    console.log(`Palvelin käynnistyi porttiin : ${Number(process.env.PORT)}`);    

});

/*
npx prisma init
sitten provideriin "mysql"
.envissä urli siihen my sql palvelimeen
määrittele prisman schemassa modelit.
kävevät aikaleimat tossa prisma schemassa
huom. vaikka vielä ei mysqlssä ole tietokantaa, niin se luodaan näin
npx prisma db push, niin se tekee sen sitten siihen urliin, mikä .envissä
sillä käyttäjällä pitää olla oikeuksia, tai käytä root käyttäjää, : ja tyhjä, kun ei ole salasanaa
muista vaan ottaa rootti sitten pois jälkeenpäin
sisältö mukaan: "seeding". kätevä, jos pitää vaikka pitää tyhjentää ja täyttää
package.jsonissa:
 "prisma": {
    "seed": "npx ts-node prisma/seed.ts"
  },

sitten: npx prisma generate, niin saadaan se clientti
tuo seed.ts, voit tehdä vaikka prisman dokumentoinnin pohjalta, tai vaikka tästä demosta
command paletteen typescript: restart ts server, niin clientti taas toimii, jos ei toiminut äsken
npx prisma db seed, niin pitäisi olla sitten kannassa
npx prisma migrate, sekin tekee ton seedin automaattisesti, mutta huom. erikseen ei sitten tarvii
sitä ajaa, ettei tule tuplatietoja.

*/