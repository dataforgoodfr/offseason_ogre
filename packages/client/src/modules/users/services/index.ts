import axios from "axios";

export { sendMagicLink };
export type { NewUser };

interface NewUser {
  email: string;
  country: string;
  firstName: string;
  lastName: string;
}

async function sendMagicLink({ email }: { email: string }) {
  const { data } = await axios.post("/api/users/magic-link", { email });
  return data;
}
