import path from "path";
import express, { Request, Response } from "express";

import bodyParser from "body-parser";
import cors from "cors";
import { apiRouter } from "./modules/apiRouter";
import { connectToDatase } from "./database";

// Parse URL-encoded bodies (as sent by HTML forms)

// parse cookies sent via http requests
// const cookieParser = require('cookie-parser');
// app.use(cookieParser())

// use cors to accept other non domain websites to access api

const app = express();

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv-flow").config();

connectToDatase();

app.use(bodyParser.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(bodyParser.json());

app.use(cors());

const port = process.env.PORT || 8080;

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
app.get("*", (_request: Request, response: Response) => {
  response.set("Cache-control", "no-cache");
  response.set("last-modified", new Date().toUTCString());
  return response.sendFile(
    path.resolve(path.join(__dirname, "../../client/build/index.html")),
    { etag: false }
  );
});

app.use((err: any, req: Request, res: Response, next: any) => {
  handleError(err, res);
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`app listening on port ${port}!`);
});

export default app;

function handleError(err: any, res: Response) {
  res.status(err.statusCode || 500).send(err.message || "Unkown error"); // TODO: remove stack when on PROD.
}
