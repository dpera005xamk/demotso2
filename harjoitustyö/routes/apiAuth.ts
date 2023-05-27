import express from 'express';
import { PrismaClient } from '@prisma/client';
import { ErrorClass } from '../errors/errorhandler';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const apiAuthRouter : express.Router = express.Router();

const prisma : PrismaClient = new PrismaClient();

apiAuthRouter.use(express.json());

apiAuthRouter.post("/login", async (req : express.Request, res : express.Response, next : express.NextFunction) : Promise<void> => {

    try {

        const user = await prisma.user.findFirst({
            where : {
                username : req.body.username
            }
        });

        if (req.body.username === user?.username) {

            let hash = crypto.createHash("SHA256").update(req.body.password).digest("hex");

            if (hash === user?.password) {

                let token = jwt.sign({ id : user.id, username : user.username }, String(process.env.ACCESS_TOKEN_KEY));

                res.json({ token : token })

            } else {
                next(new ErrorClass(401, "Virheellinen käyttäjätunnus tai salasana"));
            }

        } else {
            next(new ErrorClass(401, "Virheellinen käyttäjätunnus tai salasana"));
        }

    } catch (e: any) {
        console.log(e);
        next(new ErrorClass());
    }

});

export default apiAuthRouter;
