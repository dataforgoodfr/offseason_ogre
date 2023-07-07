import { z } from "zod";

export { getEmailSchema };

const getEmailSchema = () =>
  z
    .string()
    .email()
    .transform((email) => (email || "").trim().toLowerCase());
