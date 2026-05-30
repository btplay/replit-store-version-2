import express, { type Express } from "express";
import cors from "cors";
import { pinoHttp } from "pino-http"; // 1. Fixed the import here
import router from "./routes";
import { logger } from "./lib/logger";
import type { IncomingMessage, ServerResponse } from "http"; // 2. Imported Node's core HTTP types

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      // 3. Added explicit types to 'req' and 'res' to fix the TS7006 "implicit any" errors
      req(req: IncomingMessage & { id?: string }) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: ServerResponse) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
