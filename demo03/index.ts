import express from 'express';
import path from 'path';
import apiOstoksetRouter from './routes/apiOstokset';

const app : express.Application = express();

const portti : number = Number(process.env.PORT) || 3003;

app.use(express.static(path.resolve(__dirname, "public")));

// kaikki polut, jtoka on api/ostokset, käsittelee: apiOstoksetRouter
app.use("/api/ostokset", apiOstoksetRouter);

app.listen(portti, () => {

    console.log(`Palvelin käynnistyi porttiin : ${portti}`);    

});