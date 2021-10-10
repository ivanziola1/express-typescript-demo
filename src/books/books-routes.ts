import { CommonRoutesConfig } from "../common/common-routes-config";
import { Application, Request, Response, NextFunction } from "express";

export class BooksRoutes extends CommonRoutesConfig {
  books: { id: number; name?: string }[] = [
    { id: 1, name: "Don Quixote" },
    { id: 2, name: "Lord of the Rings" },
    { id: 3, name: "Harry Potter" },
  ];

  constructor(app: Application) {
    super(app, "BooksRoutes");
  }

  configureRoutes(): Application {
    this.app
      .route(`/books`)
      .get(async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send(this.books);
      })
      .post(async (req: Request, res: Response): Promise<Response> => {
        return res.status(200).send({});
      });

    this.app
      .route(`/books/:bookId`)
      .all((req: Request, res: Response, next: NextFunction) => {
        // auth ?
        next();
      })
      .get(async (req: Request, res: Response): Promise<Response> => {
        const book = this.books.find(
          (el) => el.id == Number(req.params.bookId)
        );
        return res.status(200).send(book);
      });

    return this.app;
  }
}
