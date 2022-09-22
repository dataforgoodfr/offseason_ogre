import { differenceInDays } from "date-fns";

export { getDaysTo2050 };

function getDaysTo2050() {
  return Math.round(differenceInDays(new Date("01/01/2050"), new Date()));
}
