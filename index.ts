import express, { Application, Request, Response } from "express";
import { format, transports } from "winston";
import { logger, LoggerOptions } from "express-winston";
import cors from "cors";
// import debug from "debug";
import { CommonRoutesConfig } from "./common/common_routes_config";
import { BooksRoutes } from "./books/books_routes";

const app: Application = express();
const port = 3000;
const routes: Array<CommonRoutesConfig> = [];
// const debugLog: debug.IDebugger = debug("app");

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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

try {
  app.listen(port);
} catch (error) {
  console.error(`Error occured: ${error.message}`);
}
