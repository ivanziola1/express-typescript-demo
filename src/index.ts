import express, { Application, Request, Response } from "express";
import { format, transports } from "winston";
import { logger, LoggerOptions } from "express-winston";
import helmet from "helmet";
import * as dotenv from "dotenv";
import cors from "cors";
// import debug from "debug";
import { errorHandler } from "./middleware/ErrorMiddleware";
import { CommonRoutesConfig } from "./common/CommonRoutesConfig";
import { PlacesRoutes } from "./controllers/places/PlacesRoutes";
import { UsersRoutes } from "./controllers/users/UsersRoutes";
import { SessionsRoutes } from "./controllers/sessions/SessionsRoutes";



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
// routes.push(new BooksRoutes(app));
routes.push(new UsersRoutes(app));
routes.push(new SessionsRoutes(app));
routes.push(new PlacesRoutes(app));


// app.get("/", async (req: Request, res: Response): Promise<Response> => {
//   return res.status(200).send({
//     message: "Hello World!",
//   });
// });

process.on('unhandledRejection', (reason: Error) => {
  throw reason;
 });

app.use(errorHandler);                                                                                                                               

try {
  app.listen(port);
} catch (error: any) {
  console.error(`Error occured: ${error.message}`);
}
