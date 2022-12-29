import { sign } from "../../tokens";
import { getApiOrigin } from "../../config";
import { isMailAlreadyUsed } from "./isMailAlreadyUsed";
import { createBusinessError } from "../../utils/businessError";
import { mails } from "../../notifications/services/mails";

export { sendMagicLink };

async function sendMagicLink(email: string) {
  if (!(await isMailAlreadyUsed(email))) {
    throw createBusinessError("USER_DOES_NOT_EXIST", { email });
  }
  const origin = getApiOrigin();
  const token = signMagicToken(email);
  const magicLink = `${origin}/api/users/sign-in?token=${token}`;
  await mails.sendMail(email, "login-magic-link", { url: magicLink });
}

function signMagicToken(email: string): string {
  return sign({ payload: { email, type: "magicLink" }, expiresIn: "24h" });
}
