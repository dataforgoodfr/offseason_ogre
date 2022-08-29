export { translateConsumptionName, translateProductionName };

function translateConsumptionName(value: string): string {
  const translationByValue = {
    airConditionning: "Air climatisé",
    cleanCook: "Cuisine écologique",
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
  const translationByValue = {
    geothermal: "Géothermie",
    hydroPower: "Hydroélectricité",
    offshoreTurbine: "Eolien offshore",
    tidal: "Marées",
    wave: "Vagues",
    biomass: "Biomasse solaire",
    onshoreWindTurbine: "Eolien terrestre",
    photovoltaicFarm: "Ferme solaire",
    photovoltaicRoof: "Photovoltaïque toiture",
    thermalSolar: "Solaire thermique",
  };
  return translationByValue[value as keyof typeof translationByValue] ?? value;
}
