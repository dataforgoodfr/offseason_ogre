import { TeamAction } from "../../../utils/types";
import { productionNames } from "./production";

export { TEAM_ACTIONS_MOCKS };

const TEAM_ACTIONS_MOCKS: TeamAction[] = [
  {
    value: 10.11,
    isTouched: true,
    action: {
      name: productionNames.biomass,
      unit: "percentage",
      min: 0,
      max: 50,
      credibilityThreshold: 25,
      credibilityDescription:
        "Votre hypothèse dépasse la production (418 TWh) du scénario Negawatt (en plus de détruire nos forêts et réduire nos capacités agricoles).",
      totalEnergy: 70.6,
      powerNeededKWh: 3.0,
      lcoe: 0.092,
    },
  },
  {
    value: 0.51,
    isTouched: false,
    action: {
      name: productionNames.onshoreWindTurbine,
      unit: "percentage",
      min: 0,
      max: 20,
      credibilityThreshold: 5.2,
      credibilityDescription:
        "Votre hypothèse dépasse le gisement national pour l'éolien terrestre (174 GW) selon le scénario 100% EnR de l'ADEME.",
      totalEnergy: 408.6,
      powerNeededKWh: 8.18,
      lcoe: 0.0605,
    },
  },
  {
    value: 1.28,
    isTouched: true,
    action: {
      name: productionNames.photovoltaicFarm,
      unit: "area",
      min: 0,
      max: 100,
      credibilityThreshold: 11,
      credibilityDescription:
        "Votre hypothèse dépasse le gisement national pour les fermes solaires (47 GW) selon le scénario 100% EnR de l'ADEME.",
      areaEnergy: 0.24,
      powerNeededKWh: 18,
      lcoe: 0.055,
    },
  },
  {
    value: 0.38,
    isTouched: false,
    action: {
      name: productionNames.photovoltaicRoof,
      unit: "area",
      min: 0,
      max: 40,
      credibilityThreshold: 31,
      credibilityDescription:
        "Votre hypothèse dépasse le gisement national pour le PV sur toitures (364 GW) selon le scénario 100% EnR de l'ADEME.",
      areaEnergy: 0.66,
      powerNeededKWh: 18,
      lcoe: 0.1425,
    },
  },
  {
    value: 5.08,
    isTouched: true,
    action: {
      name: productionNames.thermalSolar,
      unit: "area",
      min: 0,
      max: 10,
      credibilityThreshold: 5,
      credibilityDescription:
        "Votre hypothèse dépasse le gisement national pour le solaire thermique (10 GW) selon le scénario 100% EnR de l'ADEME.",
      areaEnergy: 1.32,
      powerNeededKWh: 18,
      lcoe: 0.128,
    },
  },
];
