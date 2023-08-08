import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, defaultNS } from "./resources";
import { TFunction } from "i18next";
import { getUserLocale } from "get-user-locale";
import { useTranslation } from "./useTranslation";
import { ProductionActionNames } from "../../utils/types";
import { ConsumptionName } from "../persona/consumption";

export { userLocale, translateName, useTranslation };
export const { t } = i18n;
export type { I18nTranslateFunction };

type I18nTranslateFunction = TFunction<"common", undefined>;

const userLocale = getUserLocale() || "fr";

function translateName(type: string, value: string) {
  if (type === "consumption") {
    return translateConsumptionName(value as ConsumptionName);
  } else if (type === "production") {
    return translateProductionName(value as ProductionActionNames);
  }
  return value;
}

function translateConsumptionName(value: ConsumptionName): string {
  return t(
    `consumption-actions:consumption-action.consumption-category.${value}.graph.name`
  );
}

function translateProductionName(value: ProductionActionNames): string {
  return t(
    `production-actions:production-action.fr.${value}.graph.name` as any
  );
}

i18n.use(initReactI18next).init({
  resources,
  lng: userLocale,
  fallbackLng: "fr",
  defaultNS,
  interpolation: {
    escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
  },
  returnNull: false,
});
