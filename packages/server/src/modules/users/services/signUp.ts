import { services } from ".";
import { createBusinessError } from "../../utils/businessError";
import { User } from "../types";
import { isMailAlreadyUsed } from "./isMailAlreadyUsed";
import { sendMagicLink } from "./sendMagicLink";

export { signUp };

async function signUp(newUser: Omit<User, "id">): Promise<User> {
  if (await isMailAlreadyUsed(newUser.email)) {
    throw createBusinessError("USER_ALREADY_EXISTS", { email: newUser.email });
  }
  const user = await services.create(newUser);
  await sendMagicLink(newUser.email);
  return user;
}
