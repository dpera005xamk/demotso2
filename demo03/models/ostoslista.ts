import {readFile, writeFile} from 'fs/promises';
import path from 'path';

export interface Ostos {
    id : number,
    tuote : string,
    poimittu : boolean
}

// huomaa, että alempana exportataan defaulttina
class Ostoslista {

    // private tarkoittaa, että voi lukea vain täällä, eli varmaan
    // sama kuin kapselointi pythonissa
    private ostokset : Ostos[] = [];
    private tiedosto : string[] = [__dirname, "ostokset.json"];

    // constructori tässä, contstrucotrissa sasync ei toimi, mutta then, catch, finally toimii
    constructor() {

        readFile(path.resolve(...this.tiedosto), "utf8")
            .then((data : string) => {
                this.ostokset = JSON.parse(data);
            })
            .catch((e : any) => { // isompi tarina ton tyyppi, eli nyt menee "any"
                throw new Error(e); // throw heittää eteenpäin
            });

    }

    // tämä on julkinen metodi "public"
    public haeKaikki = () : Ostos[] => {

        try {
            return this.ostokset;
        } catch (e : any) {
            throw new Error(e);
        }         

    }

    public haeYksi = (id : number) : Ostos | undefined => {

        try {
            return this.ostokset.find((ostos : Ostos) => ostos.id === id);
        } catch (e : any) {
            throw new Error(e);
        }         

    }

    // huom, piti laittaa tuo Promise<void> kun se tehdään promisena routerissa
    // ja tässä
    public lisaa = async (uusiOstos : Ostos) : Promise<void> => {

        try {

            this.ostokset = [
                ...this.ostokset,
                {   // käy ostokset läpi, järjestää id:n mukaan, ja sitten katsoo viimesen ja sen id:n eli kun siihen lisätään 1
                    // Eli tolla saadaan seuraava järjestysnumero, tässä tapauksessa
                    id : this.ostokset.sort((a : Ostos,b : Ostos) => a.id - b.id)[this.ostokset.length - 1].id + 1,
                    tuote : uusiOstos.tuote,
                    poimittu : uusiOstos.poimittu
                }                
            ];

            await this.tallenna();

        } catch (e : any) {
            throw new Error(e);
        }         

    }

    public muokkaa = async (muokattuOstos : Ostos, id : number) : Promise<void> => {

        try {
            // versio jossa ei ole muokattavaa ostosta
            this.ostokset = this.ostokset.filter((ostos : Ostos) => ostos.id !== id);

            // sitten vaan lisätään se muokattu sinne
            this.ostokset = [
                ...this.ostokset,
                {   // eli ei tehdä uutta id:tä, vaan käytetään toki samaa, mikä oli
                    id : id,
                    tuote : muokattuOstos.tuote,
                    poimittu : muokattuOstos.poimittu
                }    
                // järjestellään sitten vielä id:n mukaisesti
            ].sort((a : Ostos, b : Ostos) => a.id - b.id);

            await this.tallenna();

        } catch (e : any) {
            throw new Error(e);
        }         

    }

    public poista = async (id : number) : Promise<void> => {

        try {
            // eli tehdään taas uusi versio, jossa ei ole tuolla id:llä olevaa
            this.ostokset = this.ostokset.filter((ostos : Ostos) => ostos.id !== id);
            // sitten vain tallennus
            await this.tallenna();

        } catch (e : any) {
            throw new Error(e);
        }         

    }

    private tallenna = async () : Promise<void> => {

        try {                                               // pitää muuttaa stringiksi
            await writeFile(path.resolve(...this.tiedosto), JSON.stringify(this.ostokset, null, 2), "utf8");
        } catch (e : any) {
            throw new Error();
        }
    }

}

export default Ostoslista;