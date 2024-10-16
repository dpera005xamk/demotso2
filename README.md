# These are just my notes and templates for REST API servers

// forked, the original from https://github.com/xamk-so2/demot, of XAMK university of applied scienced, where i happen to study.
// here in my repository, there are same codes, plus my notes, so i can take a look at them later, while developing, with my own notes
// so, that i understand, what some parts do.
// notes mainly in finnish, so they might not be that usefull to you, unless if you are finn.



# sisällys:

Node.js, Express palvelimia

demo 1 :
- perusasiat ja asennus muistiinpanot

demo 2:
- Tämä on demo Web Service -tyylisestä palvelinsovelluksesta, jonka tarkoituksena on keskustella 
        toisen sovelluksen kanssa json-muodossa. Se siis lähettää eri muotoista json-dataa riippuen pyynnön 
        reitistä (urlista)

demo 3:
- rest api router: Tämä on demo REST API -palvelinsovelluksesta, jonka tarkoituksena on keskustella 
        toisen sovelluksen kanssa json-muodossa. REST API on rajapinta, joka mahdollistaa palvelimella sijaitsevien tietojen 
        lukemisen, lisäämisen, muokkaamisen ja poiston asiakassovelluksella.

demo 4:
- sama kuin ylempi, mutta kunnollisella virhekäsittelyllä. Tallenttaa tiedot json tiedostoon.

demo 5:
- rest api, Tietomallin toteutus ja käyttö Prisma ORM:n avulla (sqlite). Indexissä prisman käyttöohjeet

demo 6:
- rest api ja sen client. index.ts:ssä ohjeet, miten aloitat ts-reactin.

demo 7: 
- sama kuin ylempi, mutta siinä on vielä JWT-autorisointi. hyvä ratkaisu, niin vaan tämä tietty client pääsee siihen.
- paitsi toki ei ihan näin, seuraavassa demossa turvallisempi, kun tuossa tuo avain ihan front end koodissa.

demo 8:
- tässä menossa, eli learnissa: 4. KÄYTTÄJÄHALLINTA. mm. hyvä Login komponentti. Myös crypto ja serveripuolen loginia
- jos muutat prisman schemaa, niin: npx prisma db push, tai npx prisma generate voi toimia myös, sillä saa ainakin prisman käyntiin, jos kopioi vaan valmiit data.db:n ja scheman.

demo 9:
- tässä otetaan prismalla käyttöön ulkoinen tietokanta ja lisäksi hiukan parannusta jwt:n eli
otetaan siihen mukaan käyttäjän id ja nimi. tietokanta tehdään esim. xamppilla (tai muulla)

demo 10:
- tässä on blogi-sovellus. tehdään toisin päin tuo tietokanta, kuin äsken. esim. sanitize-html ja miten html kamaa saat front endiin turvallisesti

demo 11:
- tietokanta dumppi. käyttäjähaku serveri ja frontti. mm. injektin estoa sql serveriä varten.
- lähtökohtasesti prismassa ei tarvii tehdä sql kyselyitä, mutta jos tarvii, niin tässä kamaa.
- yleensä riittää prisman omat komennot, mutta erikoistapauksissa on mahdollista.
- käyttäjähaku-sovellus

demo 12:
- ostoslista sovellus, jossa kirjaudutaan ja näytetään sitten vain sen käyttäjän ostoslista
- herokuun julkaisua varten ohjeet

jos virhe xamppin mySql käynnistyksessä: https://www.youtube.com/watch?v=84IOtc05TuA
mahdollisesti aiheuttaa virheen, jos ensiksi avaa prisman ja vasta sitten xamppissa mysql serverin, eli se portti jää varatuksi tms..
tuossa kanssa yksi:
Stop the service. Delete from c:\xampp\mysql\data the files: "aria_log.00000001" and "aria_log_control" and start the service again. The files will be created again automatically and it will work.

tossa kanssa, jos userit on crashannut:
mysql:n config painike, siitä se .ini file, sitten siellä [mysqld] alapuolella olevalle riville: skip-grant-tables
sitten: restarttaa mysql
Now visit http://localhost/phpmyadmin/ or http://127.0.0.1/phpmyadmin/
Select mysql DB
Repair the table named user by selecting checkbox then click on Repair table
https://www.100utils.com/mysqli_real_connect-hy000-1130-host-localhost-is-not-allowed-to-connect-to-this-mariadb-server/

prodiin asti ts serveri

Install the necessary dependencies:

bash
Copy code
npm install express
Install TypeScript and development dependencies:

bash
Copy code
npm install --save-dev typescript ts-node @types/node @types/express
Step 2: Configure TypeScript
Create a tsconfig.json file to set up TypeScript configuration:

json
Copy code
{
  "compilerOptions": {
    "target": "ES6",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
outDir specifies the directory where compiled JavaScript files will be output.
rootDir specifies the source directory.
Create a folder for source code:

bash
Copy code
mkdir src
Step 3: Create a Simple Express Server
Create a src/index.ts file with the following content:
typescript
Copy code
import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
Step 4: Add Scripts for Development and Production
Update package.json to add scripts for development and production builds:
json
Copy code
"scripts": {
  "start": "node dist/index.js",
  "dev": "ts-node src/index.ts",
  "build": "tsc"
}
"dev" runs the server in development mode using ts-node.
"build" compiles TypeScript files to JavaScript in the dist folder.
"start" runs the compiled JavaScript files.
Step 5: Build the Project for Production
Compile the TypeScript code to JavaScript:

bash
Copy code
npm run build
This will create a dist directory containing the compiled JavaScript files.

Run the compiled server:

bash
Copy code
npm start
This runs the server using the compiled JavaScript files in the dist folder.

Step 6: Additional Production Configurations
For a production-ready setup, you might consider:

Environment Variables: Use a package like dotenv to manage environment variables:

bash
Copy code
npm install dotenv
Create a .env file and load it in your code:

typescript
Copy code
import dotenv from 'dotenv';
dotenv.config();
Process Management: Use pm2 or another process manager to keep the server running:

bash
Copy code
npm install pm2 -g
pm2 start dist/index.js
Linting and Code Formatting: Add ESLint and Prettier for consistent code formatting.

Following these steps will create a simple TypeScript-based Node.js Express server that is ready for production deployment.