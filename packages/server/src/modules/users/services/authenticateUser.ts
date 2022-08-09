import { z } from "zod";
import { database } from "../../../database";
import { verify } from "../../tokens";
import { User } from "../types";

export { authenticateUser };

async function authenticateUser(token = ""): Promise<User> {
  let email: string | undefined;
  try {
    const payload = verify(token);
    const payloadSchema = z.object({
      email: z.string(),
    });
    email = payloadSchema.parse(payload).email;
  } catch (err) {
    throw new Error(`Authentication token is invalid`);
  }

  if (!email) {
    throw new Error(`No email provided in token`);
  }

  const user = await database.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error(`User with such email does not exist`);
  }

  return user;
}
