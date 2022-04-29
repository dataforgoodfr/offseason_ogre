import axios from "axios";
import { User } from "../types";

export { createUser, sendMagicLink };

interface NewUser {
  email: string;
  country: string;
  firstName: string;
  lastName: string;
}

async function createUser({ newUser }: { newUser: NewUser }): Promise<User> {
  const { data } = await axios.post("/api/users", { ...newUser });
  return data.data;
}

async function sendMagicLink({ email }: { email: string }) {
  const { data } = await axios.post("/api/users/signin", { email });
  console.log(data);
  return data;
}
