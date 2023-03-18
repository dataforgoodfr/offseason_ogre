import "source-map-support/register";
import path from "path";
import express, { Request, Response } from "express";

import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import { apiRouter } from "./modules/apiRouter";
import { connectToDatase, seed } from "./database";
import { initWebSocket } from "./modules/websocket";
import { logger } from "./logger";
import { logError, setRequestId } from "./middlewares";
import { limiter } from "./middlewares/limit";
import { initErrorTracer, traceRequests } from "./error-handling";

const app = express();
initErrorTracer(app);

connectToDatase().then(seed);

traceRequests(app);
app.use(bodyParser.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

const port = process.env.PORT || 8080;

app.use(setRequestId);
app.use("/api", apiRouter);

// Serve the front.
const oneDayInMs = "86401000";
app.use(
  "/",
  express.static(path.resolve(path.join(__dirname, "../../client/build/")), {
    etag: false,
    maxAge: oneDayInMs,
  })
);

// Serving index.html by default
app.get("*", limiter, (_request: Request, response: Response) => {
  response.set("Cache-control", "no-cache");
  response.set("last-modified", new Date().toUTCString());
  return response.sendFile(
    path.resolve(path.join(__dirname, "../../client/build/index.html")),
    { etag: false }
  );
});

app.use(logError);

const { httpServer } = initWebSocket({ app });
httpServer.listen(port, () => {
  logger.info(`app listening on port ${port}!`);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  process.exit();
});

export default app;
