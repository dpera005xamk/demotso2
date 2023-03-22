import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import { Virhe } from "../errors/virhekasittelija";

const prisma : PrismaClient = new PrismaClient();

const apiAsiakkaatRouter : express.Router = express.Router();

apiAsiakkaatRouter.get("/", async (req : express.Request, res : express.Response, next : express.NextFunction) => {

    try {

        if (typeof req.query.hakusana === "string" && String(req.query.hakusana).length > 0) {

            // tietoturvasyistä apumuuttuja
            let hakusana : string = `%${req.query.hakusana}%`;

            // voi rajata sukupuolella
            let sukupuoli : string = String(req.query.sukupuoli);
                                    // raakakyselyt hyviä like
            let asiakkaat = await prisma.$queryRaw`SELECT * FROM asiakas WHERE
                                                    (etunimi LIKE ${hakusana} OR
                                                    sukunimi LIKE ${hakusana})
                                                    ${ (sukupuoli !== "undefined") ? Prisma.sql`AND sukupuoli = ${sukupuoli}` : Prisma.empty}
                                                    LIMIT 10`;
                                        // eli miten voi laittaa tänne AND, eli tolla apumuuttujalle
                                        // ja täällä sisällä ternary, eli jos sukupuoli on jotain muuta ku undefiner, niin tapahtuu seuraavaa
                                        // pitää ottaa apupaketti, koko Prisma ja sieltä prisma.sql metodia, eli tekee samaa ku queryRaw
                                        // eli tekee tarkistusta, että onko kunnollista, vai onko haittakoodia mukana
                                        // eli negatiivinen puoli pitää ottaa prismasta, eli Prisma.empty, niin saat turvallisen koodin
            res.json(asiakkaat);

        } else {
            next(new Virhe(400))
        }

       

    } catch (e : any) {
        next(new Virhe());
    }

});

export default apiAsiakkaatRouter;