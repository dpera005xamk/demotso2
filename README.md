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

