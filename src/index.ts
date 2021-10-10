import express, { Application, Request, Response } from "express";
import { format, transports } from "winston";
import { logger, LoggerOptions } from "express-winston";
import helmet from "helmet";
import * as dotenv from "dotenv";
import cors from "cors";
// import debug from "debug";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { CommonRoutesConfig } from "./common/common-routes-config";
import { BooksRoutes } from "./books/books-routes";

dotenv.config();

if (!process.env.PORT) {
  console.log("Not configured");
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app: Application = express();
const port = PORT;
const routes: Array<CommonRoutesConfig> = [];
// const debugLog: debug.IDebugger = debug("app");

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());

const loggerOptions: LoggerOptions = {
  transports: [new transports.Console()],
  format: format.combine(
    format.json(),
    format.prettyPrint(),
    format.colorize({ all: true })
  ),
};

if (!process.env.DEBUG) {
  loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

// register Logger
app.use(logger(loggerOptions));
// register Books routes
routes.push(new BooksRoutes(app));

app.get("/", async (req: Request, res: Response): Promise<Response> => {
  return res.status(200).send({
    message: "Hello World!",
  });
});

// error handlers mounted after all routes defenitions
app.use(errorHandler);
app.use(notFoundHandler);

try {
  app.listen(port);
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
