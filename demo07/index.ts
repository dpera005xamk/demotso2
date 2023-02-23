import express from 'express';
import path from 'path';
import apiOstoksetRouter from './routes/apiOstokset';
import virhekasittelija from './errors/virhekasittelija';
import jwt from 'jsonwebtoken'; // muista myös typet: npm install @types/jsonwebtoken --save-dev
// clientin package.jsoniin:  "proxy": "http://localhost:3007", niin ei tarvii corssia huom. urlit sitten clientissä myös
const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3007;

app.use((req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {
                                                // eli splitataan arrayksi, välilyönti erottavana
                                                // ja 0 se Bearer ja sehän ei kiinnosta, vaan se 1 toki
                                                // !, että tuo .split aktivoituu vain, jos ei ole undefined
        let token : string = req.headers.authorization!.split(" ")[1];

        jwt.verify(token, "SuuriSalaisuus!!!"); // eli tää ei enää päästä eteenpäin, jos väärin
                                                // eli menee tohon 401:n

        next(); // tärkeä, että menee eteenpäin.

    } catch (e: any) {
        res.status(401).json({}); // 401 on unauthorized
    }

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