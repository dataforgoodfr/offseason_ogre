import invariant from "tiny-invariant";
import sendGridMail from "@sendgrid/mail";
import { sign } from "../../tokens";
import { getApiOrigin } from "../../config";

export { sendMagicLink };

async function sendMagicLink(email: string) {
  const origin = getApiOrigin();
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
