import { CommonRoutesConfig } from "../../common/CommonRoutesConfig";
import { Application, Request, Response, NextFunction } from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import NotFoundError from "../../common/errors/NotFoundError";
import bcrypt from "bcrypt";
import { generateAuthToken, validateUser } from "../../models/User";
import auth from "../../middleware/AuthMidleware";
import BadRequestError from "../../common/errors/BadRequestError";

const prisma = new PrismaClient();

export class UsersRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "UsersRoutes");
  }

  configureRoutes(): Application {
    this.app
      .route('/register')
      .post(async (req: Request, res: Response, next: NextFunction) => {
        const { name, email, password } = req.body;
        const { error } = validateUser(req.body);
        if (error) next(new BadRequestError(error.details[0].message));

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const encryptedPassword = await bcrypt.hash(password, salt);
        prisma.user
          .create({
            data: {
              email,
              name,
              password: encryptedPassword,
            },
          })
          .then((user) => {
            const authToken = generateAuthToken({ id: user.id, name, email });
            // generate token
            res.status(200).send({ authToken });
          })
          .catch((e) => {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
              if (e.code === 'P2002') {
                return next(new BadRequestError("User with this email exists"));
              }
              next(e);
            }
            next(e);
          });
      });
    
    this.app
    .route('/users/me')
    .get(auth, async(req: Request, res: Response, next: NextFunction) => {
      prisma.user
      .findFirst({ where: { id: req.user.id }, rejectOnNotFound: true })
      .then((user) => res.status(200).send({ id: user.id, name: user.name, email: user.email }))
      .catch(() => {
        next(new NotFoundError(`User is not found`))
      });
    });
    return this.app;
  }
}
