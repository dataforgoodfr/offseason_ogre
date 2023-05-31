import { http } from "../../../utils/request";

export { sendMagicLink };
export type { NewUser };

interface NewUser {
  email: string;
  country: string;
  firstName: string;
  lastName: string;
}

async function sendMagicLink({ email }: { email: string }) {
  const { data } = await http.post("/api/users/magic-link", { email });
  return data;
}
