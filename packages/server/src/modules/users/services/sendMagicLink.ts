import invariant from "tiny-invariant";
import sendGridMail from "@sendgrid/mail";
import { sign } from "../../tokens";

export { sendMagicLink };

async function sendMagicLink(email: string) {
  const origin = getOrigin();
  const token = signMagicToken(email);
  const magicLink = `${origin}/api/users/sign-in?token=${token}`;
  await sendMail({
    to: email,
    from: "grandeur.energies@gmail.com",
    subject: "Votre lien de connexion OGRE",
    text: "Votre lien: ",
    html: `<p><a href="${magicLink}">${magicLink}</a></p>`,
  });
}

function signMagicToken(email: string): string {
  return sign({ payload: { email, type: "magicLink" }, expiresIn: "24h" });
}

function getOrigin(): string {
  if (process.env.ORIGIN) {
    return process.env.ORIGIN;
  }
  if (process.env.NODE_ENV === "production") {
    return "https://atelierogre.herokuapp.com";
  }
  if (process.env.NODE_ENV === "staging") {
    return "https://atelierogre-staging.herokuapp.com";
  }
  return "http://localhost:3001";
}

async function sendMail(msg: {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}) {
  const apiKey = process.env.SENDGRID_API_KEY;
  invariant(apiKey, "SENDGRID_API_KEY must be set in env variables.");
  sendGridMail.setApiKey(apiKey);
  await sendGridMail.send(msg);
}
