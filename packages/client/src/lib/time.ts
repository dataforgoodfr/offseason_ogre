import { differenceInDays } from "date-fns";
import { ENERGY_SHIFT_TARGET_YEAR } from "../modules/common/constants";
import { userLocale } from "../modules/translations";

export { formatDate, getDaysTo2050, getDaysToEnergyShiftTargetYear };

type DateFormat = "date-at-time" | "full-date-at-time";

function getDateFormatOptions(format: DateFormat): Intl.DateTimeFormatOptions {
  if (format === "date-at-time") {
    return {
      dateStyle: "long",
      timeStyle: "short",
    };
  }
  if (format === "full-date-at-time") {
    return {
      dateStyle: "full",
      timeStyle: "short",
    };
  }

  return {};
}

function formatDate(
  date: string | number | Date | null | undefined,
  format: DateFormat
) {
  if (date == null) {
    return "";
  }

  return new Intl.DateTimeFormat(
    userLocale,
    getDateFormatOptions(format)
  ).format(new Date(date));
}

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
