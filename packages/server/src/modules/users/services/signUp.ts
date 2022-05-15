import { services } from ".";
import { User } from "../types";
import { isMailAlreadyUsed } from "./isMailAlreadyUsed";
import { sendMagicLink } from "./sendMagicLink";

export { signUp };

async function signUp(newUser: Omit<User, "id">): Promise<User> {
  if (await isMailAlreadyUsed(newUser.email)) {
    throw new Error("Email is already taken.");
  }
  const user = await services.create(newUser);
  await sendMagicLink(newUser.email);
  return user;
}
