import { CommonRoutesConfig } from "../../common/CommonRoutesConfig";
import { Application, Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateAuthToken, validateLogin } from "../../models/User";
import BadRequestError from "../../common/errors/BadRequestError";

const prisma = new PrismaClient();

export class SessionsRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "SessionsRoutes");
  }

  configureRoutes(): Application {
    this.app
      .route('/login')
      .post(async (req: Request, res: Response, next: NextFunction) => {
        const { email } = req.body;
        const { error } = validateLogin(req.body);
        if (error) return next(new BadRequestError(error.details[0].message));
        
        try {
          const user = await prisma.user.findUnique({
            where: {
              email,
            }
          });
          if (!user) return next(new BadRequestError("Invalid email or password"));

          const validPassword = await bcrypt.compare(
            req.body.password,
            user.password
          );
          if (!validPassword) return next(new BadRequestError("Invalid email or password"));
          
          const authToken = generateAuthToken({ id: user.id, name: user.name, email: user.email });
          return res.status(200).send({ authToken });
        } catch {
            return next(new BadRequestError("Invalid email or password"));
          }
        });
    return this.app;
  }
}
