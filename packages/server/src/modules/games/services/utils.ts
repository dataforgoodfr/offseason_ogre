import { pickRandomChar } from "../../../lib/string";

const ALPHA_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGIT_CHARS = "0123456789";

const CODE_CHARS = ALPHA_CHARS + DIGIT_CHARS;
const CODE_LENGTH = 6;

export const generateCode = () => {
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i += 1) {
    code += pickRandomChar(CODE_CHARS);
  }
  return `${code.substring(0, Math.floor(CODE_LENGTH / 2))}-${code.substring(
    Math.floor(CODE_LENGTH / 2)
  )}`;
};
