import translationFr from "./fr.json";

export { t, translateName };

function t(key: keyof typeof translationFr) {
  return translationFr[key] || key;
}

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
