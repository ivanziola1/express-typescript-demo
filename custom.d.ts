import { SafeUser } from "./src/models/User";

declare global {
  namespace Express {
    export interface Request {
      user?: any;
    }
  }
}
