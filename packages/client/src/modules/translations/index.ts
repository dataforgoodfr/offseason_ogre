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
    airConditionning: "Air climatisé",
    cleanCook: "Cuisine",
    brownGoods: "Produits bruns",
    electricCar: "Voiture électrique",
    light: "Lumière",
    fossilCar: "Voiture thermique",
    fossilHeating: "Chauffage thermique",
    greyCar: "Voiture (gris)",
    greyHouse: "Maison (gris)",
    greyNumeric: "Numérique (gris)",
    greyOther: "Autre (gris)",
    greyTransport: "Transport (gris)",
    food: "Nourriture",
    noCarbonHeating: "Chauffage décarbonné",
    plane: "Avion",
    servicePublic: "Service public",
    train: "Train",
  };
  return translationByValue[value as keyof typeof translationByValue] ?? value;
}

function translateProductionName(value: string): string {
  return t(`production.energy.${value}.graph.name` as any);
}
