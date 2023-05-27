import express from 'express';
import { ErrorClass } from '../errors/errorhandler';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const prisma: PrismaClient = new PrismaClient();

const apiUsersRouter: express.Router = express.Router();

apiUsersRouter.use(express.json());
/*
apiUsersRouter.delete("/:id", async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    if (await prisma.user.count({
        where: {
            id: req.params.id
        }
    })) {
        try {

            await prisma.user.delete({
                where: {
                    id: req.params.id
                }
            });

            res.json(await prisma.user.findMany());

        } catch (e: any) {
            next(new ErrorClass())
        }
    } else {
        next(new ErrorClass(400, "Virheellinen id"));
    }

});
*/

apiUsersRouter.put("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    let userData = jwt.verify(req.body.token, String(process.env.ACCESS_TOKEN_KEY));

    let user: any = undefined;

    if (typeof userData === 'string') {

        // it can not be string
        next(new ErrorClass(400, "Virheellinen pyynnön body"));

    } else {
        
        user = await prisma.user.findFirst({
            where: {
                id: userData.id
            }
        });

        // check that old password matches
        let hash = crypto.createHash("SHA256").update(req.body.oldPassword).digest("hex");

        if (hash === user?.password) {

            // old password is ok, lets change it to new:
            try {
    
                await prisma.user.update({
                    where: {
                        id: userData.id
                    },
                    data: {
                        ...user,
                        password: crypto.createHash("SHA256").update(req.body.newPassword).digest("hex")
                    }
                });

                res.status(200).json({"message: ": "changed"});

            } catch (e: any) {
                next(new ErrorClass())
            }

        } else {
            console.log('different password');
            next(new ErrorClass(401, "Virheellinen käyttäjätunnus tai salasana"));
        }
        console.log('user: ', user);
    }

});

apiUsersRouter.post("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    if (req.body.username &&
        req.body.password) {

        try {

            const allUsers = await prisma.user.findMany();
            const existingUser = allUsers.filter(useri => req.body.username === useri.username);

            if (existingUser.length === 1) {
                console.log('in use');
                return res.status(400).json({
                    message: "Käyttäjätunnus on jo käytössä.",
                });
            }

            await prisma.user.create({
                data: {
                    id: crypto.randomUUID(),
                    username: req.body.username,
                    password: crypto.createHash("SHA256").update(req.body.password).digest("hex"),
                    admin: false
                }
            });

            return res.status(200).json({ message: "käyttäjätunnus luotu!" });

        } catch (e: any) {
            console.log(e);
            next(new ErrorClass())
        }

    } else {
        next(new ErrorClass(400, "Virheellinen pyynnön body"));
    }

});
/*
apiUsersRouter.get("/:id", async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {

        if (await prisma.user.count({
            where: {
                id: Number(req.params.id)
            }
        }) === 1) {
            res.json(await prisma.user.findUnique({
                where: {
                    id: Number(req.params.id)
                }
            }))
        } else {
            next(new ErrorClass(400, "Virheellinen id"));
        }

    } catch (e: any) {
        next(new ErrorClass());
    }


});
*/

apiUsersRouter.get("/", async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    try {
        res.json(await prisma.user.findMany());
    } catch (e: any) {
        next(new ErrorClass());
    }

});

export default apiUsersRouter;