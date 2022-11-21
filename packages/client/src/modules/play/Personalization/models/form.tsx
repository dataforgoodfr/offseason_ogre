import { range } from "lodash";
import { buildChoices } from "../utils/choices";

export const persoFormInputs = [
  "numberAdults",
  "numberKids",
  "car",
  "carEnergy",
  "carConsumption",
  "carDistanceAlone",
  "carDistanceHoushold",
  "carAge",
  "carDistanceCarsharing",
  "planeDistance",
  "trainDistance",
  "houseType",
  "houseSurface",
  "heatingEnergy",
  "heatingConsumption",
  "heatingInvoice",
  "heatPump",
  "heatingTemperature",
  "airConditionning",
  "aCRoomNb",
  "aCDaysNb",
  "showerBath",
  "showerNumber",
  "showerTime",
  "cookingKettle",
  "cookingPlateTime",
  "cookingOvenTime",
  "cleaningWashingTime",
  "cleaningDryerTime",
  "cleaningDishwasherTime",
  "refrigeratorNumber",
  "freezerNumber",
  "lightingSystem",
  "eatingVegan",
  "eatingVegetables",
  "eatingDairies",
  "eatingEggs",
  "eatingMeat",
  "eatingTinDrink",
  "eatingZeroWaste",
  "eatingLocal",
  "eatingCatNumber",
  "eatingDogNumber",
  "eatingHorse",
  "numericEquipment",
  "numericWebTimeDay",
  "numericVideoTimeDay",
  "clothingQuantity",
];

export interface PersoForm {
  numberAdults: number;
  numberKids: number;
  car: boolean;
  carEnergy: string;
  carConsumption: number;
  carDistanceAlone: number;
  carDistanceHoushold: number;
  carAge: string;
  carDistanceCarsharing: number;
  planeDistance: number;
  trainDistance: number;
  houseType: string;
  houseSurface: number;
  heatingEnergy: string;
  heatingConsumption: number;
  heatingInvoice: number;
  heatPump: boolean;
  heatingTemperature: boolean;
  airConditionning: boolean;
  aCRoomNb: number;
  aCDaysNb: number;
  showerBath: string;
  showerNumber: number;
  showerTime: string;
  cookingKettle: boolean;
  cookingPlateTime: number;
  cookingOvenTime: number;
  cleaningWashingTime: number;
  cleaningDryerTime: number;
  cleaningDishwasherTime: number;
  refrigeratorNumber: number;
  freezerNumber: number;
  lightingSystem: string;
  eatingVegan: boolean;
  eatingVegetables: boolean;
  eatingDairies: boolean;
  eatingEggs: boolean;
  eatingMeat: boolean;
  eatingTinDrink: number;
  eatingZeroWaste: boolean;
  eatingLocal: boolean;
  eatingCatNumber: number;
  eatingDogNumber: number;
  eatingHorse: boolean;
  numericEquipment: boolean;
  numericWebTimeDay: boolean;
  numericVideoTimeDay: boolean;
  clothingQuantity: boolean;
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
  defaultValue?: boolean | string | number;
}

export const carEnergies = {
  DIESEL: "Diesel",
  ELECTRICITE: "Electricité",
  ESSENCE: "Essence",
  GPL: "GPL",
  HYBRIDE: "Hybride",
};

export const carAges = {
  MOINS_5: "Moins de 5 ans",
  CINQ_DIX: "Entre 5 et 10 ans",
  DIX_QUINZE: "Entre 10 et 15 ans",
  PLUS_15: "Plus de 15 ans",
};

export const houseTypes = {
  APPARTMENT: "Appartement",
  INDIVIDUAL: "Maison individuelle",
  MITOYENNE: "Maison mitoyenne",
  STUDIO: "Studio (1 pièce)",
};

export const houseEnergies = {
  BOIS: "Bois",
  ELECTRICITE: "Electricité",
  FIOUL: "Fioul",
  GAZ: "Gaz",
};

export const cleaning = {
  BAINS: "Bains",
  DOUCHES: "Douches",
};

export const lighting = {
  AMPOULES_BASSE_CONSOMMATION: "Ampoules basse consommation",
  AMPOULES_CLASSIQUES: "Ampoules classiques et halogènes",
  AMPOULES_LED: "Ampoules LED",
};

export const showerTimes = {
  MOINS_5: "Moins de 5 minutes",
  CINQ_DIX: "5 à 10 minutes",
  DIX_QUINZE: "10 à 15 minutes",
  PLUS_15: "Plus de 15 minutes",
};

export const carEnergyChoice = buildChoices(Object.values(carEnergies));

export const carAgeChoice = buildChoices(Object.values(carAges));

export const houseTypeChoices = buildChoices(Object.values(houseTypes));

export const houseEnergyChoices = buildChoices(Object.values(houseEnergies));

export const showerBathChoices = buildChoices(Object.values(cleaning));

export const lightingSystemChoices = buildChoices(Object.values(lighting));

export const showerTimesChoices = buildChoices(Object.values(showerTimes));

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
      name: "numberAdults" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(1, 11)),
      defaultValue: 1,
    },
    {
      description:
        "Combien d'enfants de moins de 18 ans habitent au sein de votre logement ?",
      name: "numberKids" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
      defaultValue: 0,
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
      name: "car" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      icon: "car",
      description: "Quelle énergie utilise votre voiture ?",
      name: "carEnergy" as keyof PersoForm,
      conditions: [{ question: "car", operator: "=", value: true }],
      inputType: "list",
      valueType: "string",
      options: carEnergyChoice,
      defaultValue: carEnergies.ESSENCE,
    },
    {
      icon: "car",
      description:
        "Quelle est la consommation moyenne, en litres pour 100km, de ce véhicule ?",
      name: "carConsumption" as keyof PersoForm,
      conditions: [
        { question: "car", operator: "=", value: true },
        {
          question: "carEnergy",
          operator: "!=",
          value: carEnergies.ELECTRICITE,
        },
      ],
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
    },
    {
      icon: "car",
      description:
        "En moyenne, combien de km par an parcourez-vous seul en voiture ?",
      name: "carDistanceAlone" as keyof PersoForm,
      conditions: [{ question: "car", operator: "=", value: true }],
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
    },
    {
      icon: "car",
      description:
        "En moyenne, combien de km parcourez vous-seul par an en voiture avec les personnes composant le ménage ?",
      name: "carDistanceHoushold" as keyof PersoForm,
      conditions: [
        { question: "car", operator: "=", value: true },
        { question: "numberAdults", operator: ">", value: 1 },
      ],
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
    },
    {
      icon: "car",
      description:
        "En moyenne, quelle est votre fréquence de remplacement de votre véhicule ?",
      name: "carAge" as keyof PersoForm,
      conditions: [{ question: "car", operator: "=", value: true }],
      inputType: "list",
      valueType: "string",
      options: carAgeChoice,
      defaultValue: carAges.DIX_QUINZE,
    },
    {
      description:
        "Même si vous ne possédez pas de voiture, combien de kilomètres par an effectuez-vous en moyenne (avec d'autres personnes) ?",
      name: "carDistanceCarsharing" as keyof PersoForm,
      conditions: [{ question: "car", operator: "=", value: false }],
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
    },
    {
      icon: "plane",
      description:
        "Avion - En moyenne, combien de kilomètres par an parcourez-vous ? (Faites une moyenne sur les 5 dernières années)",
      name: "planeDistance" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
    },
    {
      icon: "train",
      description:
        "Train - En moyenne, combien de kilomètres par an parcourez-vous ? (Faites une moyenne sur les 5 dernières années)",
      name: "trainDistance" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
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
      name: "houseType" as keyof PersoForm,
      inputType: "list",
      valueType: "string",
      options: houseTypeChoices,
      defaultValue: houseTypes.APPARTMENT,
    },
    {
      description: `Quelle est la surface de votre logement (en m${"\u00b2"}) ?`,
      name: "houseSurface" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 1,
    },
    {
      description: "Quelle est l'énergie principale de chauffage ?",
      name: "heatingEnergy" as keyof PersoForm,
      inputType: "list",
      valueType: "string",
      options: houseEnergyChoices,
      defaultValue: houseEnergies.FIOUL,
    },
    {
      description:
        "Quel est le nombre de kWh (kilowatt-heure) consommé PAR AN ? Cette valeur est disponible sur la facture transmise par votre fournisseur d'énergie. Si jamais vous ne savez pas, vous pouvez passer à la question suivante où cette valeur vous est demandée en € ou CHF",
      name: "heatingConsumption" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
    },
    {
      description:
        "Quel est le montant de votre facture d'énergie ANNUELLE pour le chauffage (fioul, gaz, bois) ? Si vous avez un chauffage électrique, indiquez le montant ANNUEL de votre facture.",
      name: "heatingInvoice" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
    },
    {
      description:
        "Est-ce que vous avez installé une pompe à chaleur de type air/eau ou eau/eau ?",
      name: "heatPump" as keyof PersoForm,
      conditions: [
        {
          question: "heatingEnergy",
          operator: "=",
          value: houseEnergies.ELECTRICITE,
        },
      ],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      description: "Votre température de confort est-elle supérieure à 19°C ?",
      name: "heatingTemperature" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      description: "Utilisez-vous un système de climatisation ?",
      name: "airConditionning" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      description:
        "Combien de pièces de votre logement sont équipées d'un système de climatisation?",
      name: "aCRoomNb" as keyof PersoForm,
      conditions: [
        { question: "airConditionning", operator: "=", value: true },
      ],
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
      defaultValue: 0,
    },
    {
      description:
        "En moyenne, combien de jours par an votre système de climatisation fonctionne-t-il?",
      name: "aCDaysNb" as keyof PersoForm,
      conditions: [
        { question: "airConditionning", operator: "=", value: true },
      ],
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
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
      name: "showerBath" as keyof PersoForm,
      inputType: "list",
      valueType: "string",
      options: showerBathChoices,
      defaultValue: cleaning.DOUCHES,
    },
    {
      description:
        "En moyenne, combien de fois par jour prenez-vous une douche ?",
      name: "showerNumber" as keyof PersoForm,
      conditions: [
        { question: "showerBath", operator: "=", value: cleaning.DOUCHES },
      ],
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(1, 11)),
      defaultValue: 1,
    },
    {
      description: "En moyenne, combien de temps dure une douche ?",
      name: "showerTime" as keyof PersoForm,
      conditions: [
        { question: "showerBath", operator: "=", value: cleaning.DOUCHES },
      ],
      inputType: "list",
      valueType: "string",
      options: showerTimesChoices,
      defaultValue: showerTimes.CINQ_DIX,
    },
    {
      description: "Utilisez-vous une bouilloire pour chauffer l'eau ?",
      name: "cookingKettle" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      description:
        "En moyenne, combien de temps par jour utilisez-vous vos plaques de cuisson ? (indiquer 0,5 pour 30 minutes)",
      name: "cookingPlateTime" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
    },
    {
      description:
        "En moyenne, combien de temps par jour utilisez-vous votre four ? (indiquer 0,5 pour 30 minutes, 1 pour une heure, ...)",
      name: "cookingOvenTime" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
    },
    {
      description:
        "En moyenne, combien de temps par jour utilisez-vous votre lave-linge? (indiquer 0,5 pour 30 minutes, 1 pour une heure, ...)",
      name: "cleaningWashingTime" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
    },
    {
      description:
        "En moyenne, combien de temps par jour utilisez-vous votre sèche-linge ? (indiquer 0,5 pour 30 minutes ou 0 si vous n'en avez pas)",
      name: "cleaningDryerTime" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
    },
    {
      description:
        "En moyenne, combien de temps par jour utilisez-vous votre lave-vaisselle ? (indiquer 0,5 pour 30 minutes ou 0 si vous n'en avez pas)",
      name: "cleaningDishwasherTime" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
    },
    {
      description: "Combien de réfrigérateurs possédez-vous ?",
      name: "refrigeratorNumber" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
      defaultValue: 0,
    },
    {
      description: "Combien de congélateurs possédez-vous ?",
      name: "freezerNumber" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
      defaultValue: 0,
    },
    {
      description: "Quel est votre système d'éclairage ?",
      name: "lightingSystem" as keyof PersoForm,
      inputType: "list",
      valueType: "string",
      options: lightingSystemChoices,
      defaultValue: lighting.AMPOULES_CLASSIQUES,
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
      name: "eatingVegan" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      description: "Consommez-vous des fruits et des légumes ?",
      name: "eatingVegetables" as keyof PersoForm,
      conditions: [{ question: "eatingVegan", operator: "=", value: false }],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      description: "Consommez-vous des produits laitiers ?",
      name: "eatingDairies" as keyof PersoForm,
      conditions: [{ question: "eatingVegan", operator: "=", value: false }],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      description: "Consommez-vous des oeufs ?",
      name: "eatingEggs" as keyof PersoForm,
      conditions: [{ question: "eatingVegan", operator: "=", value: false }],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      description: "Consommez-vous de la viande ?",
      name: "eatingMeat" as keyof PersoForm,
      conditions: [{ question: "eatingVegan", operator: "=", value: false }],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      description:
        "En moyenne, combien de boissons en canette consommez-vous par jour ?",
      name: "eatingTinDrink" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
    },
    {
      description: "Achetez-vous uniquement des produits sans emballage ?",
      name: "eatingZeroWaste" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      description:
        "Consommez-vous uniquement des produits locaux et de saison ?",
      name: "eatingLocal" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      description: "Combien avez-vous de chats ?",
      name: "eatingCatNumber" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
      defaultValue: 0,
    },
    {
      description: "Combien avez-vous de chiens ?",
      name: "eatingDogNumber" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
      defaultValue: 0,
    },
    {
      description: "Avez-vous un cheval ?",
      name: "eatingHorse" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
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
      name: "numericEquipment" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      description: "En moyenne, passez-vous plus de 2h par jour sur Internet ?",
      name: "numericWebTimeDay" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      description:
        "En moyenne, regardez-vous plus d'une heure de vidéos par jour ?",
      name: "numericVideoTimeDay" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      description:
        "En moyenne, achetez-vous plus de 600€ de vêtements et chaussures par an ?",
      name: "clothingQuantity" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
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
