import express from 'express';

export class Virhe extends Error { // Error käsittääkseni sisään rakennettu, josta tämä laajennetaan
    status : number // nämä this.status.. en tajua täysin...
    viesti : string // varmaan, niin kun oli ennen reactissa, että mahdollistaa niiden käytön tms...
    constructor(status? : number, viesti? : string) {
        super(); // koska Errorista laajenee
        this.status = status || 500;
        this.viesti = viesti || "Palvelimella tapahtui odottamaton virhe";
    }

}

const virhekasittelija = (err : Virhe, req : express.Request, res : express.Response, next : express.NextFunction) => {

    // siinä hyvä virheen raportointi
    res.status(err.status).json({virhe : err.viesti});

    // jos menee tästä läpi, eli 404. Jota tämä ei voi, kun se käsitellään eri tasolla
    next();

}

export default virhekasittelija;