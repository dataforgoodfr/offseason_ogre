import * as jwt from "jsonwebtoken";
import invariant from "tiny-invariant";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({ path: `${__dirname}/../../../.env` });

invariant(
  process.env.SECRET_KEY !== undefined,
  "SECRET_KEY is missing in your environment"
);
const secretKey = process.env.SECRET_KEY;

export { verify, sign };

function verify(token: string) {
  return jwt.verify(token, secretKey);
}

function sign({
  payload,
  expiresIn,
}: {
  payload: string | object | Buffer;
  expiresIn: string;
}) {
  return jwt.sign(payload, secretKey, {
    algorithm: "HS256",
    expiresIn,
  });
}
