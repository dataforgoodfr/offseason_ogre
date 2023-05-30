import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { resources, defaultNS } from "./resources";
import { TFunction } from "i18next";
import { getUserLocale } from "get-user-locale";
import { useTranslation } from "./useTranslation";

export { userLocale, translateName, useTranslation };
export const { t } = i18n;
export type { I18nTranslateFunction };

type I18nTranslateFunction = TFunction<"common", undefined>;

const userLocale = getUserLocale() || "fr";

function translateName(type: string, value: string) {
  if (type === "consumption") {
    return translateConsumptionName(value);
  } else if (type === "production") {
    return translateProductionName(value);
  }
  return value;
}

function translateConsumptionName(value: string): string {
  const translationByValue = {
    airConditionning: "Climatisation",
    cleanCook: "Lavage, Cuisson, Nettoyage, Refroidissement",
    brownGoods: "Usage des outils numériques",
    electricCar: "Voiture électrique",
    light: "Éclairage",
    fossilCar: "Voiture thermique",
    fossilHeating: "Chauffage fossile",
    greyCar: "Fabrication de la voiture (énergie grise)",
    greyHouse: "Fabrication des bâtiments et des routes (énergie grise)",
    greyNumeric: "Numérique (énergie grise)",
    greyOther: "Autres (énergie grise)",
    greyTransport: "Fret (énergie grise)",
    food: "Se nourrir",
    noCarbonHeating: "Chauffage décarboné",
    plane: "Avion",
    servicePublic: "Service public",
    train: "Train",
  };
  return translationByValue[value as keyof typeof translationByValue] ?? value;
}

function translateProductionName(value: string): string {
  return t(`production.energy.${value}.graph.name` as any);
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
