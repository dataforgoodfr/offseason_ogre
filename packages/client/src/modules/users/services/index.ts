import axios from "axios";
import { User } from "../types";

export { createUser };

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
