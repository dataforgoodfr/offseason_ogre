import { z } from "zod";

export const dateSchema = z.preprocess(
  (arg) =>
    typeof arg === "string" || arg instanceof Date ? new Date(arg) : arg,
  z.date()
);
