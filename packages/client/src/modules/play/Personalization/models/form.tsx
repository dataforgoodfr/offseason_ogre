import { range } from "lodash";
import { IconName } from "../../../common/components/Icon";
import { buildChoices } from "../utils/choices";

export type FormStatus = "draft" | "pendingValidation" | "validated";

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
  icon?: IconName;
  name: keyof PersoForm;
  conditions?: Condition[];
  inputType: string;
  valueType: string;
  options?: DropdownOption[];
  defaultValue?: boolean | string | number;
  credibilityConditions?: Condition[];
}

export interface IntermediateValues {
  whiteProductsCoeff: number;
  showerBathCoeff: number;
  brownGoodsCoeff: number;
  heatingConsumptionInvoiceCoeff: number;
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
} as const;

const getGeneralQuestions = () => {
  const generalQuestions: Omit<Question, "type">[] = [
    {
      name: "numberAdults" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(1, 11)),
      defaultValue: 1,
      credibilityConditions: [
        { question: "numberAdults", operator: ">", value: 2 },
      ],
    },
    {
      name: "numberKids" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
      defaultValue: 0,
      credibilityConditions: [
        { question: "numberKids", operator: ">", value: 4 },
      ],
    },
  ];
  return generalQuestions.map((question: Omit<Question, "type">) => ({
    type: formSections.GENERAL.name,
    ...question,
  }));
};

const getTransportQuestions = () => {
  const transportQuestions: Omit<Question, "type">[] = [
    {
      icon: "car",
      name: "car" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
      credibilityConditions: [{ question: "car", operator: "=", value: false }],
    },
    {
      icon: "car",
      name: "carEnergy" as keyof PersoForm,
      conditions: [{ question: "car", operator: "=", value: true }],
      inputType: "list",
      valueType: "string",
      options: carEnergyChoice,
      defaultValue: carEnergies.ESSENCE,
      credibilityConditions: [
        {
          question: "carEnergy",
          operator: "=",
          value: carEnergies.ELECTRICITE,
        },
      ],
    },
    {
      icon: "car",
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
      credibilityConditions: [
        { question: "carConsumption", operator: ">=", value: 15 },
      ],
    },
    {
      icon: "car",
      name: "carDistanceAlone" as keyof PersoForm,
      conditions: [{ question: "car", operator: "=", value: true }],
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
      credibilityConditions: [
        { question: "carDistanceAlone", operator: ">=", value: 50000 },
      ],
    },
    {
      icon: "car",
      name: "carDistanceHoushold" as keyof PersoForm,
      conditions: [
        { question: "car", operator: "=", value: true },
        { question: "numberAdults", operator: ">", value: 1 },
      ],
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
      credibilityConditions: [
        { question: "carDistanceHoushold", operator: ">=", value: 25000 },
      ],
    },
    {
      icon: "car",
      name: "carAge" as keyof PersoForm,
      conditions: [{ question: "car", operator: "=", value: true }],
      inputType: "list",
      valueType: "string",
      options: carAgeChoice,
      defaultValue: carAges.DIX_QUINZE,
      credibilityConditions: [
        { question: "carAge", operator: "=", value: carAges.PLUS_15 },
      ],
    },
    {
      icon: "car",
      name: "carDistanceCarsharing" as keyof PersoForm,
      conditions: [{ question: "car", operator: "=", value: false }],
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
      credibilityConditions: [
        { question: "carDistanceCarsharing", operator: "=", value: 0 },
      ],
    },
    {
      icon: "plane",
      name: "planeDistance" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
      credibilityConditions: [
        { question: "planeDistance", operator: ">=", value: 100000 },
      ],
    },
    {
      icon: "train",
      name: "trainDistance" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
      credibilityConditions: [
        { question: "trainDistance", operator: ">=", value: 30000 },
      ],
    },
  ];
  return transportQuestions.map((question: Omit<Question, "type">) => ({
    type: formSections.TRANSPORT.name,
    ...question,
  }));
};

const getHousingQuestions = () => {
  const housingQuestions: Omit<Question, "type">[] = [
    {
      name: "houseType" as keyof PersoForm,
      inputType: "list",
      valueType: "string",
      options: houseTypeChoices,
      defaultValue: houseTypes.APPARTMENT,
    },
    {
      name: "houseSurface" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 1,
      credibilityConditions: [
        { question: "houseSurface", operator: ">", value: 250 },
      ],
    },
    {
      name: "heatingEnergy" as keyof PersoForm,
      inputType: "list",
      valueType: "string",
      options: houseEnergyChoices,
      defaultValue: houseEnergies.FIOUL,
      credibilityConditions: [
        { question: "heatingEnergy", operator: "=", value: houseEnergies.BOIS },
      ],
    },
    {
      name: "heatingConsumption" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
    },
    {
      name: "heatingInvoice" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
      credibilityConditions: [
        { question: "heatingInvoice", operator: ">=", value: 3000 },
        { question: "heatingInvoice", operator: "<", value: 200 },
      ],
    },
    {
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
      name: "heatingTemperature" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      name: "airConditionning" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      name: "aCRoomNb" as keyof PersoForm,
      conditions: [
        { question: "airConditionning", operator: "=", value: true },
      ],
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
      defaultValue: 0,
      credibilityConditions: [
        { question: "aCRoomNb", operator: ">", value: 5 },
      ],
    },
    {
      name: "aCDaysNb" as keyof PersoForm,
      conditions: [
        { question: "airConditionning", operator: "=", value: true },
      ],
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
      credibilityConditions: [
        { question: "aCDaysNb", operator: ">", value: 365 },
      ],
    },
  ];
  return housingQuestions.map((question: Omit<Question, "type">) => ({
    type: formSections.HOUSING.name,
    ...question,
  }));
};

const getHabitsQuestions = () => {
  const habitsQuestions: Omit<Question, "type">[] = [
    {
      name: "showerBath" as keyof PersoForm,
      inputType: "list",
      valueType: "string",
      options: showerBathChoices,
      defaultValue: cleaning.DOUCHES,
      credibilityConditions: [
        { question: "showerBath", operator: "=", value: cleaning.BAINS },
      ],
    },
    {
      name: "showerNumber" as keyof PersoForm,
      conditions: [
        { question: "showerBath", operator: "=", value: cleaning.DOUCHES },
      ],
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(1, 11)),
      defaultValue: 1,
      credibilityConditions: [
        { question: "showerBath", operator: ">", value: 2 },
      ],
    },
    {
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
      name: "cookingKettle" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      name: "cookingPlateTime" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
      credibilityConditions: [
        { question: "cookingPlateTime", operator: ">", value: 2 },
      ],
    },
    {
      name: "cookingOvenTime" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
      credibilityConditions: [
        { question: "cookingOvenTime", operator: ">", value: 2 },
      ],
    },
    {
      name: "cleaningWashingTime" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
      credibilityConditions: [
        { question: "cleaningWashingTime", operator: ">", value: 2 },
      ],
    },
    {
      name: "cleaningDryerTime" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
      credibilityConditions: [
        { question: "cleaningDryerTime", operator: ">", value: 2 },
      ],
    },
    {
      name: "cleaningDishwasherTime" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
      credibilityConditions: [
        { question: "cleaningDishwasherTime", operator: ">", value: 2 },
      ],
    },
    {
      name: "refrigeratorNumber" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
      defaultValue: 0,
      credibilityConditions: [
        { question: "refrigeratorNumber", operator: ">", value: 2 },
      ],
    },
    {
      name: "freezerNumber" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
      defaultValue: 0,
      credibilityConditions: [
        { question: "freezerNumber", operator: ">", value: 2 },
      ],
    },
    {
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
  const foodQuestions: Omit<Question, "type">[] = [
    {
      name: "eatingVegan" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      name: "eatingVegetables" as keyof PersoForm,
      conditions: [{ question: "eatingVegan", operator: "=", value: false }],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
      credibilityConditions: [
        { question: "eatingVegetables", operator: "=", value: false },
      ],
    },
    {
      name: "eatingDairies" as keyof PersoForm,
      conditions: [{ question: "eatingVegan", operator: "=", value: false }],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      name: "eatingEggs" as keyof PersoForm,
      conditions: [{ question: "eatingVegan", operator: "=", value: false }],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      name: "eatingMeat" as keyof PersoForm,
      conditions: [{ question: "eatingVegan", operator: "=", value: false }],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      name: "eatingTinDrink" as keyof PersoForm,
      inputType: "free",
      valueType: "number",
      defaultValue: 0,
      credibilityConditions: [
        { question: "eatingTinDrink", operator: ">", value: 3 },
      ],
    },
    {
      name: "eatingZeroWaste" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      name: "eatingLocal" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      name: "eatingCatNumber" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
      defaultValue: 0,
      credibilityConditions: [
        { question: "eatingCatNumber", operator: ">", value: 3 },
      ],
    },
    {
      name: "eatingDogNumber" as keyof PersoForm,
      inputType: "list",
      valueType: "number",
      options: buildChoices(range(0, 11)),
      defaultValue: 0,
      credibilityConditions: [
        { question: "eatingDogNumber", operator: ">", value: 3 },
      ],
    },
    {
      name: "eatingHorse" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
      credibilityConditions: [
        { question: "eatingHorse", operator: "=", value: true },
      ],
    },
  ];
  return foodQuestions.map((question: Omit<Question, "type">) => ({
    type: formSections.FOOD.name,
    ...question,
  }));
};

const getNumericQuestions = () => {
  const numericQuestions: Omit<Question, "type">[] = [
    {
      name: "numericEquipment" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      name: "numericWebTimeDay" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
      name: "numericVideoTimeDay" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoice,
      defaultValue: false,
    },
    {
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

export const getQuestionByName = (name: string) => {
  return formValues.find((question: Question) => question.name === name);
};
