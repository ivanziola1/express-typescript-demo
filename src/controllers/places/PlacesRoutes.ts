import { CommonRoutesConfig } from "../../common/CommonRoutesConfig";
import { Application, Request, Response, NextFunction } from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import HttpException from "../../common/errors/HttpError";
import UnprocessableEntityError from "../../common/errors/UnprocessableEntityError";
import NotFoundError from "../../common/errors/NotFoundError";

const prisma = new PrismaClient();

export class PlacesRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "PlacesRoutes");
  }

  configureRoutes(): Application {
    this.app
      .route(`/places`)
      .get(async (req: Request, res: Response) => {
        const places = await prisma.place.findMany({ where: { state: "accepted" } });
        return res.json(places).status(200);
      })
      .post(async (req: Request, res: Response, next: NextFunction) => {
        const { title, description, tags, workingHours, imageUrl } = req.body;
        // TODO add validation
        prisma.place
          .create({
            data: {
              title,
              description,
              tags,
              workingHours,
              imageUrl,
              state: "accepted",
            },
          })
          .then((place) => res.status(200).send(place))
          .catch((e) => {
            if (e instanceof Prisma.PrismaClientValidationError) {
              next(new UnprocessableEntityError(e.message));
            }

            next(e);
          });
      });

    this.app
      .route(`/places/:placeId`)
      // .all((req: Request, res: Response, next: NextFunction) => {
      //   // auth ?
      //   next();
      // })
      .get(async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.placeId);
        prisma.place
          .findFirst({ where: { id }, rejectOnNotFound: true })
          .then((place) => res.status(200).send(place))
          .catch(() =>
            next(new NotFoundError(`Place with id ${id} is not found`))
          );
      });
    return this.app;
  }
}
