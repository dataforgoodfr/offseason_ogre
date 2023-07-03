import { differenceInDays } from "date-fns";
import { ENERGY_SHIFT_TARGET_YEAR } from "../modules/common/constants";

export { getDaysTo2050, getDaysToEnergyShiftTargetYear };

// TODO: Replace use with getDaysToEnergyShiftTargetYear.
/**
 * @deprecated Use getDaysToEnergyShiftTargetYear instead.
 */
function getDaysTo2050() {
  return Math.round(differenceInDays(new Date("01/01/2050"), new Date()));
}

function getDaysToEnergyShiftTargetYear(refDate: Date = new Date()) {
  return Math.round(
    differenceInDays(new Date(`01/01/${ENERGY_SHIFT_TARGET_YEAR}`), refDate)
  );
}
