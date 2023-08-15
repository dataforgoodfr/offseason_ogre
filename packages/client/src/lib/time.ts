import { differenceInDays } from "date-fns";
import { ENERGY_SHIFT_TARGET_YEAR } from "../modules/common/constants";
import { userLocale } from "../modules/translations";

export { formatDate, getDaysToEnergyShiftTargetYear };

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

function getDaysToEnergyShiftTargetYear(refDate: Date = new Date()) {
  return Math.round(
    differenceInDays(new Date(`01/01/${ENERGY_SHIFT_TARGET_YEAR}`), refDate)
  );
}
