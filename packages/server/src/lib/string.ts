import { random } from "lodash";

export const pickRandomChar = (str: string) =>
  str.charAt(random(str.length - 1));
