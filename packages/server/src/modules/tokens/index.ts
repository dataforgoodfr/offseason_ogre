import * as jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY || "secret_key";

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
