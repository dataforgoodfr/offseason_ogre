import { range } from "lodash";
import { buildChoices } from "../utils/choices";

export interface PersoForm {
  profileNumberAdults: number;
  profileNumberKids: number;
  profileCar: boolean;
  profileCarEnergy: string;
  profileCarConsumption: number;
  profileCarDistanceAlone: number;
  profileCarDistanceHoushold: number;
  profileCarAge: string;
  profileCarDistanceCarsharing: number;
  profilePlaneDistance: number;
  profileTrainDistance: number;
  profileHouseType: string;
  profileHouseSurface: number;
  profileHeatingEnergy: string;
  profileHeatingConsumption: number;
  profileHeatingInvoice: number;
  profileHeatPump: boolean;
  profileHeatingTemperature: boolean;
  profileAirCondtitionning: boolean;
  profileACRoomNb: number;
  profileACDaysNb: number;
  profileShowerBath: string;
  profileShowerNumber: number;
  profileShowerTime: string;
  profileCookingKettle: boolean;
  profileCookingPlateTime: number;
  profileCookingOvenTime: number;
  profileCleaningWashingTime: number;
  profileCleaningDryerTime: number;
  profileCleaningDishwasherTime: number;
  profileRefrigeratorNumber: number;
  profileFreezerNumber: number;
  profileLightingSystem: string;
  profileEatingVegan: boolean;
  profileEatingVegetables: boolean;
  profileEatingDairies: boolean;
  profileEatingEggs: boolean;
  profileEatingMeat: boolean;
  profileEatingTinDrink: number;
  profileEatingZeroWaste: boolean;
  profileEatingLocal: boolean;
  profileEatingCatNumber: number;
  profileEatingDogNumber: number;
  profileEatingHorse: boolean;
  profileNumericEquipment: boolean;
  profileNumericWebTimeDay: boolean;
  profileNumericVideoTimeDay: boolean;
  profileClothingQuantity: boolean;
}

export interface DropdownOption {
  value: boolean | string | number;
  description: boolean | string | number;
}

export interface Condition {
  question: string;
  operator: string;
  value: boolean | number | string;
}

export interface Question {
  type: string;
  icon?: string;
  description: string;
  name: keyof PersoForm;
  conditions?: Condition[];
  inputType: string;
  valueType: string;
  options?: DropdownOption[];
}

export const carEnergyChoice = buildChoices([
  "Essence",
  "Diesel",
  "GPL",
  "Hybride",
  "Electricité",
  "Autre",
]);

export const carAgeChoice = buildChoices([
  "Moins de 5 ans",
  "Entre 5 et 10 ans",
  "Entre 10 et 15 ans",
  "Plus de 15 ans",
]);

export const houseType = buildChoices([
  "Maison individuelle",
  "Maison mitoyenne",
  "Appartement",
  "Studio (1 pièce)",
]);

export const houseEnergy = buildChoices([
  "Fioul",
  "Gaz",
  "Electricité",
  "Bois",
]);

export const showerBath = buildChoices(["Bains", "Douches"]);

export const lightingSystem = buildChoices([
  "Ampoules classiques et halogènes",
  "Ampoules basse consommation",
  "Ampoules LED",
]);

export const showerTimes = buildChoices([
  "Moins de 5 minutes",
  "5 à 10 minutes",
  "10 à 15 minutes",
  "Plus de 15 minutes",
]);

export const booleanChoice = [
  { value: true, description: "Oui" },
  { value: false, description: "Non" },
];

export const formSections = {
  GENERAL: { name: "general", title: "Général", titleIcon: "player-pin" },
  TRANSPORT: { name: "transport", title: "Déplacement", titleIcon: "car" },
  HOUSING: { name: "housing", title: "Logement", titleIcon: "house" },
  HABITS: {
    name: "habits",
    title: "Habitudes de consommation",
    titleIcon: "microwave",
  },
  FOOD: { name: "food", title: "Alimentation", titleIcon: "food" },
  NUMERIC: { name: "numeric", title: "Numérique", titleIcon: "computer" },
};

const getGeneralQuestions = () => {
  const generalQuestions = [
    {
      description: "Combien d'adultes habitent au sein de votre logement ?",
      name: "profileNumberAdults" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(1, 11)),
    },
    {
      description:
        "Combien d'enfants de moins de 18 ans habitent au sein de votre logement ?",
      name: "profileNumberKids" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
    },
  ];
  return generalQuestions.map((question: Omit<Question, "type">) => ({
    type: formSections.GENERAL.name,
    ...question,
  }));
};

const getTransportQuestions = () => {
  const transportQuestions = [
    {
      icon: "car",
      description: "Avez-vous une voiture ?",
      name: "profileCar" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
    },
    {
      icon: "car",
      description: "Quelle énergie utilise votre voiture ?",
      name: "profileCarEnergy" as keyof PersoForm,
      conditions: [{ question: "profileCar", operator: "=", value: true }],
      inputType: "list",
      valueType: "string",
      options: carEnergyChoice,
    },
    {
      icon: "car",
      description:
        "Quelle est la consommation moyenne, en litres pour 100km, de ce véhicule ?",
      name: "profileCarConsumption" as keyof PersoForm,
      conditions: [{ question: "profileCar", operator: "=", value: true }],
      inputType: "free",
      valueType: "number",
    },
    {
      icon: "car",
      description:
        "En moyenne, combien de km par an parcourez-vous seul en voiture ?",
      name: "profileCarDistanceAlone" as keyof PersoForm,
      conditions: [{ question: "profileCar", operator: "=", value: true }],
      inputType: "free",
      valueType: "number",
    },
    {
      icon: "car",
      description:
        "En moyenne, combien de km parcourez vous-seul par an en voiture avec les personnes composant le ménage ?",
      name: "profileCarDistanceHoushold" as keyof PersoForm,
      conditions: [
        { question: "profileCar", operator: "=", value: true },
        { question: "profileNumberAdults", operator: ">", value: 1 },
      ],
      inputType: "free",
      valueType: "number",
    },
    {
      icon: "car",
      description:
        "En moyenne, quelle est votre fréquence de remplacement de votre véhicule ?",
      name: "profileCarAge" as keyof PersoForm,
      conditions: [{ question: "profileCar", operator: "=", value: true }],
      inputType: "list",
      valueType: "string",
      options: carAgeChoice,
    },
    {
      description:
        "Même si vous ne possédez pas de voiture, combien de kilomètres par an effectuez-vous en moyenne (avec d'autres personnes) ?",
      name: "profileCarDistanceCarsharing" as keyof PersoForm,
      conditions: [{ question: "profileCar", operator: "=", value: false }],
      inputType: "free",
      valueType: "number",
    },
    {
      icon: "plane",
      description:
        "Avion - En moyenne, combien de kilomètres par an parcourez-vous ? (Faites une moyenne sur les 5 dernières années)",
      name: "profilePlaneDistance" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
    },
    {
      icon: "train",
      description:
        "Train - En moyenne, combien de kilomètres par an parcourez-vous ? (Faites une moyenne sur les 5 dernières années)",
      name: "profileTrainDistance" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
    },
  ];
  return transportQuestions.map((question: Omit<Question, "type">) => ({
    type: formSections.TRANSPORT.name,
    ...question,
  }));
};

const getHousingQuestions = () => {
  const housingQuestions = [
    {
      description: "Quel est le type de votre logement ?",
      name: "profileHouseType" as keyof PersoForm,
      inputType: "list",
      valueType: "string",
      options: houseType,
    },
    {
      description: `Quelle est la surface de votre logement (en m${"\u00b2"}) ?`,
      name: "profileHouseSurface" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
    },
    {
      description: "Quelle est l'énergie principale de chauffage ?",
      name: "profileHeatingEnergy" as keyof PersoForm,
      inputType: "list",
      valueType: "string",
      options: houseEnergy,
    },
    {
      description:
        "Quel est le nombre de kWh (kilowatt-heure) consommé PAR AN ? Cette valeur est disponible sur la facture transmise par votre fournisseur d'énergie. Si jamais vous ne savez pas, vous pouvez passer à la question suivante où cette valeur vous est demandée en € ou CHF",
      name: "profileHeatingConsumption" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
    },
    {
      description:
        "Quel est le montant de votre facture d'énergie ANNUELLE pour le chauffage (fioul, gaz, bois) ? Si vous avez un chauffage électrique, indiquez le montant ANNUEL de votre facture.",
      name: "profileHeatingInvoice" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
    },
    {
      description:
        "Est-ce que vous avez installé une pompe à chaleur de type air/eau ou eau/eau ?",
      name: "profileHeatPump" as keyof PersoForm,
      conditions: [
        {
          question: "profileHeatingEnergy",
          operator: "=",
          value: "Electricité",
        },
      ],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
    },
    {
      description: "Votre température de confort est-elle supérieure à 19°C ?",
      name: "profileHeatingTemperature" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
    },
    {
      description: "Utilisez-vous un système de climatisation ?",
      name: "profileAirCondtitionning" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
    },
    {
      description:
        "Combien de pièces de votre logement sont équipées d'un système de climatisation?",
      name: "profileACRoomNb" as keyof PersoForm,
      conditions: [
        { question: "profileAirCondtitionning", operator: "=", value: true },
      ],
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
    },
    {
      description:
        "En moyenne, combien de jours par an votre système de climatisation fonctionne-t-il?",
      name: "profileACRoomNb" as keyof PersoForm,
      conditions: [
        { question: "profileAirCondtitionning", operator: "=", value: true },
      ],
      inputType: "free",
      valueType: "number",
    },
  ];
  return housingQuestions.map((question: Omit<Question, "type">) => ({
    type: formSections.HOUSING.name,
    ...question,
  }));
};

const getHabitsQuestions = () => {
  const habitsQuestions = [
    {
      description: "Prenez-vous des bains ou des douches ?",
      name: "profileShowerBath" as keyof PersoForm,
      inputType: "list",
      valueType: "string",
      options: showerBath,
    },
    {
      description:
        "En moyenne, combien de fois par jour prenez-vous une douche ?",
      name: "profileShowerNumber" as keyof PersoForm,
      conditions: [
        { question: "profileShowerBath", operator: "=", value: "Douches" },
      ],
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(1, 11)),
    },
    {
      description: "En moyenne, combien de temps dure une douche ?",
      name: "profileShowerTime" as keyof PersoForm,
      conditions: [
        { question: "profileShowerBath", operator: "=", value: "Douches" },
      ],
      inputType: "list",
      valueType: "string",
      options: showerTimes,
    },
    {
      description: "Utilisez-vous une bouilloire pour chauffer l'eau ?",
      name: "profileCookingKettle" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
    },
    {
      description:
        "En moyenne, combien de temps par jour utilisez-vous vos plaques de cuisson ? (indiquer 0,5 pour 30 minutes)",
      name: "profileCookingPlateTime" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
    },
    {
      description:
        "En moyenne, combien de temps par jour utilisez-vous votre four ? (indiquer 0,5 pour 30 minutes, 1 pour une heure, ...)",
      name: "profileCookingOvenTime" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
    },
    {
      description:
        "En moyenne, combien de temps par jour utilisez-vous votre lave-linge? (indiquer 0,5 pour 30 minutes, 1 pour une heure, ...)",
      name: "profileCleaningWashingTime" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
    },
    {
      description:
        "En moyenne, combien de temps par jour utilisez-vous votre sèche-linge ? (indiquer 0,5 pour 30 minutes ou 0 si vous n'en avez pas)",
      name: "profileCleaningDryerTime" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
    },
    {
      description:
        "En moyenne, combien de temps par jour utilisez-vous votre lave-vaisselle ? (indiquer 0,5 pour 30 minutes ou 0 si vous n'en avez pas)",
      name: "profileCleaningDishwasherTime" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
    },
    {
      description: "Combien de réfrigérateurs possédez-vous ?",
      name: "profileRefrigeratorNumber" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
    },
    {
      description: "Combien de congélateurs possédez-vous ?",
      name: "profileFreezerNumber" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
    },
    {
      description: "Quel est votre système d'éclairage ?",
      name: "profileLightingSystem" as keyof PersoForm,
      inputType: "list",
      valueType: "string",
      options: lightingSystem,
    },
  ];
  return habitsQuestions.map((question: Omit<Question, "type">) => ({
    type: formSections.HABITS.name,
    ...question,
  }));
};

const getFoodQuestions = () => {
  const foodQuestions = [
    {
      description: "Êtes-vous végétalien (vegan) ?",
      name: "profileEatingVegan" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
    },
    {
      description: "Consommez-vous des fruits et des légumes ?",
      name: "profileEatingVegetables" as keyof PersoForm,
      conditions: [
        { question: "profileEatingVegan", operator: "=", value: false },
      ],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
    },
    {
      description: "Consommez-vous des produits laitiers ?",
      name: "profileEatingDairies" as keyof PersoForm,
      conditions: [
        { question: "profileEatingVegan", operator: "=", value: false },
      ],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
    },
    {
      description: "Consommez-vous des oeufs ?",
      name: "profileEatingEggs" as keyof PersoForm,
      conditions: [
        { question: "profileEatingVegan", operator: "=", value: false },
      ],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
    },
    {
      description: "Consommez-vous de la viande ?",
      name: "profileEatingMeat" as keyof PersoForm,
      conditions: [
        { question: "profileEatingVegan", operator: "=", value: false },
      ],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
    },
    {
      description:
        "En moyenne, combien de boissons en canette consommez-vous par jour ?",
      name: "profileEatingTinDrink" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
    },
    {
      description: "Achetez-vous uniquement des produits sans emballage ?",
      name: "profileEatingZeroWaste" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
    },
    {
      description: "Consommez-vous uniquement des produits locaux et de saison",
      name: "profileEatingLocal" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
    },
    {
      description: "Combien avez-vous de chats ?",
      name: "profileEatingCatNumber" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
    },
    {
      description: "Combien avez-vous de chiens ?",
      name: "profileEatingDogNumber" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
    },
    {
      description: "Avez-vous un cheval ?",
      name: "profileEatingHorse" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
    },
  ];
  return foodQuestions.map((question: Omit<Question, "type">) => ({
    type: formSections.FOOD.name,
    ...question,
  }));
};

const getNumericQuestions = () => {
  const numericQuestions = [
    {
      description:
        "Avez-vous au moins un équipement numérique par personne dans le foyer ?",
      name: "profileNumericEquipment" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
    },
    {
      description: "En moyenne, passez-vous plus de 2h par jour sur Internet ?",
      name: "profileNumericWebTimeDay" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
    },
    {
      description:
        "En moyenne, regardez-vous plus d'une heure de vidéos par jour ?",
      name: "profileNumericVideoTimeDay" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
    },
    {
      description:
        "En moyenne, achetez-vous plus de 600€ de vêtements et chaussures par an ?",
      name: "profileClothingQuantity" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
    },
  ];
  return numericQuestions.map((question: Omit<Question, "type">) => ({
    type: formSections.NUMERIC.name,
    ...question,
  }));
};

export const formValues = [
  ...getGeneralQuestions(),
  ...getTransportQuestions(),
  ...getHousingQuestions(),
  ...getHabitsQuestions(),
  ...getFoodQuestions(),
  ...getNumericQuestions(),
];
