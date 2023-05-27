import { sign } from "../../tokens";
import { WEB_APP_URL } from "../../config";
import { isMailAlreadyUsed } from "./isMailAlreadyUsed";
import { createBusinessError } from "../../utils/businessError";
import { mails } from "../../notifications/services/mails";

export { sendMagicLink };

async function sendMagicLink(email: string) {
  if (!(await isMailAlreadyUsed(email))) {
    throw createBusinessError("USER_DOES_NOT_EXIST", { email });
  }
  const token = signMagicToken(email);
  const magicLink = `${WEB_APP_URL}/sign-in?token=${token}`;
  await mails.sendMail(email, "login-magic-link", { url: magicLink });
}

function signMagicToken(email: string): string {
  return sign({ payload: { email, type: "magicLink" }, expiresIn: "24h" });
}
