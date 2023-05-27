import express from 'express';
import { ErrorClass } from '../errors/errorhandler';
import { PrismaClient } from '@prisma/client';

// setup of encrypting
const crypto = require("crypto");
const algorithm = process.env.ALGORITHM;
const initVector = process.env.INITVECTOR;
const securityKey = process.env.SECRETCRYPTKEY;

interface Creds {
    id: number
    page: string
    username: string
    password: string
    userId: string
}

const fetchAndDecrypt = async (userId: string) => {

    let creds: Array<Creds> = await prisma.credentials.findMany({
        where: {
            userId: userId
        }
    })

    const mapped: Array<Creds> = creds.map(cred => {
        const decipher1 = crypto.createDecipheriv(algorithm, securityKey, initVector);
        const decipher2 = crypto.createDecipheriv(algorithm, securityKey, initVector);
        const decipher3 = crypto.createDecipheriv(algorithm, securityKey, initVector);

        let page = decipher1.update(cred.page, "hex", "utf-8")
        page += decipher1.final("utf8");

        let username = decipher2.update(cred.username, "hex", "utf-8")
        username += decipher2.final("utf8");

        let password = decipher3.update(cred.password, "hex", "utf-8")
        password += decipher3.final("utf8");

        return { ...cred, page: page, username: username, password: password }
    });

    return mapped;
}

const encryptData = async (page: string, username: string, password: string) => {
    // encrypts the new entry with these
    const cipher1 = crypto.createCipheriv(algorithm, securityKey, initVector);
    const cipher2 = crypto.createCipheriv(algorithm, securityKey, initVector);
    const cipher3 = crypto.createCipheriv(algorithm, securityKey, initVector);

    let encryptedPage = cipher1.update(page, "utf-8", "hex");
    let encryptedUsername = cipher2.update(username, "utf-8", "hex");
    let encryptedPassword = cipher3.update(password, "utf-8", "hex");

    encryptedPage += cipher1.final("hex");
    encryptedUsername += cipher2.final("hex");
    encryptedPassword += cipher3.final("hex");

    return { page: encryptedPage, username: encryptedUsername, password: encryptedPassword };
}

const prisma: PrismaClient = new PrismaClient();

const apiCredentialsRouter: express.Router = express.Router();

apiCredentialsRouter.use(express.json());

apiCredentialsRouter.delete("/:id", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    
    if (await prisma.credentials.count({
        where: {
            id: Number(req.params.id)
        }
    })) {
        try {

            await prisma.credentials.delete({
                where: {
                    id: Number(req.params.id)
                }
            });

            const mapped = await fetchAndDecrypt(res.locals.user.id);

            res.json(mapped);

        } catch (e: any) {
            next(new ErrorClass())
        }
    } else {
        next(new ErrorClass(400, "Virheellinen id"));
    }

});


apiCredentialsRouter.put("/:id", async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    if (await prisma.credentials.count({
        where: {
            id: Number(req.params.id)
        }
    })) {
        if ((req.body?.page.length > 0 &&
            req.body?.username.length > 0 &&
            req.body?.password.length > 0)) {

            // encrypts the new entry with these
            const encryptValues = await encryptData(req.body.page, req.body.username, req.body.password);

            try {

                await prisma.credentials.update({
                    where: {
                        id: Number(req.params.id)
                    },
                    data: {
                        page: encryptValues.page,
                        username: encryptValues.username,
                        password: encryptValues.password,
                        userId: res.locals.user.id
                    }
                });

                const mapped = await fetchAndDecrypt(res.locals.user.id);

                res.json(mapped);

            } catch (e: any) {
                next(new ErrorClass())
            }

        } else {
            next(new ErrorClass(400, "Virheellinen pyynnön body"));
        }
    } else {
        next(new ErrorClass(400, "Virheellinen id"));
    }

});

apiCredentialsRouter.post("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {



    if (req.body?.page.length > 0 &&
        req.body?.username.length > 0 &&
        req.body?.password.length > 0) {

        // encrypts the new entry with these
        const encryptValues = await encryptData(req.body.page, req.body.username, req.body.password);

        try {

            await prisma.credentials.create({
                data: {
                    page: encryptValues.page,
                    username: encryptValues.username,
                    password: encryptValues.password,
                    userId: res.locals.user.id
                }
            });

            // this fetches from database and decrypts
            const mapped = await fetchAndDecrypt(res.locals.user.id);

            res.json(mapped);

        } catch (e: any) {
            console.log(e);
            next(new ErrorClass())
        }

    } else {
        next(new ErrorClass(400, "Virheellinen pyynnön body"));
    }

});

apiCredentialsRouter.get("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {

        const mapped = await fetchAndDecrypt(res.locals.user.id);

        res.json(mapped);

    } catch (e: any) {
        next(new ErrorClass());
    }

});

export default apiCredentialsRouter;