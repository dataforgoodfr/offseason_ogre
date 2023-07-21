import { range } from "lodash";
import { IconName } from "../../../common/components/Icon";
import { buildChoices } from "../utils/choices";
import { t } from "../../../translations";

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

type Choices = Record<
  string,
  { value: string; description: string; order?: number }
>;

export const carEnergies: Choices = {
  DIESEL: {
    value: "Diesel",
    description: t("consumption-profiles:form.choice.car-energy.diesel"),
  },
  ELECTRICITE: {
    value: "Electricité",
    description: t("consumption-profiles:form.choice.car-energy.electricity"),
  },
  ESSENCE: {
    value: "Essence",
    description: t("consumption-profiles:form.choice.car-energy.gasoline"),
  },
  GPL: {
    value: "GPL",
    description: t(
      "consumption-profiles:form.choice.car-energy.liquified-petroleum-gas"
    ),
  },
  HYBRIDE: {
    value: "Hybride",
    description: t("consumption-profiles:form.choice.car-energy.hybrid"),
  },
};

export const carAges: Choices = {
  MOINS_5: {
    value: "Moins de 5 ans",
    description: t("consumption-profiles:form.choice.car-age.lt-5-years"),
    order: 1,
  },
  CINQ_DIX: {
    value: "Entre 5 et 10 ans",
    description: t("consumption-profiles:form.choice.car-age.gt-5-lt-10-years"),
    order: 2,
  },
  DIX_QUINZE: {
    value: "Entre 10 et 15 ans",
    description: t(
      "consumption-profiles:form.choice.car-age.gt-10-lt-15-years"
    ),
    order: 3,
  },
  PLUS_15: {
    value: "Plus de 15 ans",
    description: t("consumption-profiles:form.choice.car-age.gt-15-years"),
    order: 4,
  },
};

export const houseTypes: Choices = {
  APPARTMENT: {
    value: "Appartement",
    description: t("consumption-profiles:form.choice.house-type.apartment"),
  },
  INDIVIDUAL: {
    value: "Maison individuelle",
    description: t("consumption-profiles:form.choice.house-type.detached"),
  },
  MITOYENNE: {
    value: "Maison mitoyenne",
    description: t("consumption-profiles:form.choice.house-type.attached"),
  },
  STUDIO: {
    value: "Studio (1 pièce)",
    description: t("consumption-profiles:form.choice.house-type.studio"),
  },
};

export const houseEnergies: Choices = {
  BOIS: {
    value: "Bois",
    description: t(
      "consumption-profiles:form.choice.house-heating-energy.wood"
    ),
  },
  ELECTRICITE: {
    value: "Electricité",
    description: t(
      "consumption-profiles:form.choice.house-heating-energy.electricity"
    ),
  },
  FIOUL: {
    value: "Fioul",
    description: t(
      "consumption-profiles:form.choice.house-heating-energy.fuel"
    ),
  },
  GAZ: {
    value: "Gaz",
    description: t("consumption-profiles:form.choice.house-heating-energy.gas"),
  },
};

export const hygieneCleaning: Choices = {
  BAINS: {
    value: "Bains",
    description: t("consumption-profiles:form.choice.hygiene-cleaning.bath"),
  },
  DOUCHES: {
    value: "Douches",
    description: t("consumption-profiles:form.choice.hygiene-cleaning.shower"),
  },
};

export const houseLighting: Choices = {
  AMPOULES_CLASSIQUES: {
    value: "Ampoules classiques et halogènes",
    description: t(
      "consumption-profiles:form.choice.house-lighting.classic-bulb"
    ),
    order: 1,
  },
  AMPOULES_BASSE_CONSOMMATION: {
    value: "Ampoules basse consommation",
    description: t(
      "consumption-profiles:form.choice.house-lighting.low-energy-bulb"
    ),
    order: 2,
  },
  AMPOULES_LED: {
    value: "Ampoules LED",
    description: t("consumption-profiles:form.choice.house-lighting.led"),
    order: 3,
  },
};

export const showerTimes: Choices = {
  MOINS_5: {
    value: "Moins de 5 minutes",
    description: t(
      "consumption-profiles:form.choice.hygiene-cleaning-shower-time.lt-5-minutes"
    ),
    order: 1,
  },
  CINQ_DIX: {
    value: "5 à 10 minutes",
    description: t(
      "consumption-profiles:form.choice.hygiene-cleaning-shower-time.gt-5-lt-10-minutes"
    ),
    order: 2,
  },
  DIX_QUINZE: {
    value: "10 à 15 minutes",
    description: t(
      "consumption-profiles:form.choice.hygiene-cleaning-shower-time.gt-10-lt-15-minutes"
    ),
    order: 3,
  },
  PLUS_15: {
    value: "Plus de 15 minutes",
    description: t(
      "consumption-profiles:form.choice.hygiene-cleaning-shower-time.gt-15-minutes"
    ),
    order: 4,
  },
};

export const booleanChoices = [
  {
    value: true,
    description: t("consumption-profiles:form.choice.boolean.yes"),
  },
  {
    value: false,
    description: t("consumption-profiles:form.choice.boolean.no"),
  },
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
      options: booleanChoices,
      defaultValue: false,
      credibilityConditions: [{ question: "car", operator: "=", value: false }],
    },
    {
      icon: "car",
      name: "carEnergy" as keyof PersoForm,
      conditions: [{ question: "car", operator: "=", value: true }],
      inputType: "list",
      valueType: "string",
      options: buildChoices(carEnergies),
      defaultValue: carEnergies.ESSENCE.value,
      credibilityConditions: [
        {
          question: "carEnergy",
          operator: "=",
          value: carEnergies.ELECTRICITE.value,
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
          value: carEnergies.ELECTRICITE.value,
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
      options: buildChoices(carAges),
      defaultValue: carAges.DIX_QUINZE.value,
      credibilityConditions: [
        { question: "carAge", operator: "=", value: carAges.PLUS_15.value },
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
      options: buildChoices(houseTypes),
      defaultValue: houseTypes.APPARTMENT.value,
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
      options: buildChoices(houseEnergies),
      defaultValue: houseEnergies.FIOUL.value,
      credibilityConditions: [
        {
          question: "heatingEnergy",
          operator: "=",
          value: houseEnergies.BOIS.value,
        },
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
          value: houseEnergies.ELECTRICITE.value,
        },
      ],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoices,
      defaultValue: false,
    },
    {
      name: "heatingTemperature" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoices,
      defaultValue: false,
    },
    {
      name: "airConditionning" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoices,
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
      options: buildChoices(hygieneCleaning),
      defaultValue: hygieneCleaning.DOUCHES.value,
      credibilityConditions: [
        {
          question: "showerBath",
          operator: "=",
          value: hygieneCleaning.BAINS.value,
        },
      ],
    },
    {
      name: "showerNumber" as keyof PersoForm,
      conditions: [
        {
          question: "showerBath",
          operator: "=",
          value: hygieneCleaning.DOUCHES.value,
        },
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
        {
          question: "showerBath",
          operator: "=",
          value: hygieneCleaning.DOUCHES.value,
        },
      ],
      inputType: "list",
      valueType: "string",
      options: buildChoices(showerTimes),
      defaultValue: showerTimes.CINQ_DIX.value,
    },
    {
      name: "cookingKettle" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoices,
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
      options: buildChoices(houseLighting),
      defaultValue: houseLighting.AMPOULES_CLASSIQUES.value,
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
      options: booleanChoices,
      defaultValue: false,
    },
    {
      name: "eatingVegetables" as keyof PersoForm,
      conditions: [{ question: "eatingVegan", operator: "=", value: false }],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoices,
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
      options: booleanChoices,
      defaultValue: false,
    },
    {
      name: "eatingEggs" as keyof PersoForm,
      conditions: [{ question: "eatingVegan", operator: "=", value: false }],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoices,
      defaultValue: false,
    },
    {
      name: "eatingMeat" as keyof PersoForm,
      conditions: [{ question: "eatingVegan", operator: "=", value: false }],
      inputType: "list",
      valueType: "boolean",
      options: booleanChoices,
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
      options: booleanChoices,
      defaultValue: false,
    },
    {
      name: "eatingLocal" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoices,
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
      options: booleanChoices,
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
      options: booleanChoices,
      defaultValue: false,
    },
    {
      name: "numericWebTimeDay" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoices,
      defaultValue: false,
    },
    {
      name: "numericVideoTimeDay" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoices,
      defaultValue: false,
    },
    {
      name: "clothingQuantity" as keyof PersoForm,
      inputType: "list",
      valueType: "boolean",
      options: booleanChoices,
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
