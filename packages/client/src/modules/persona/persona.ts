import { PersoForm } from "../play/Personalization/models/form";
import { fillPersonalization } from "./utils";
import {
  computeCarbonProductionElectricMix,
  computeCarbonFootprint,
} from "../play/utils/carbonFootprint";
import { ConsumptionDatum, getConsumptionFromProfile } from "./consumption";
import { production, ProductionDatum } from "./production";
import { computeIntermediateValues } from "./consumption/computing";
import {
  computeMaterials,
  MaterialsDatum,
} from "../play/gameEngines/materialsEngine";
import { useAuth } from "../auth/authProvider";
import { ITeamWithPlayers, Player, TeamAction } from "../../utils/types";
import { usePlay } from "../play/context/playContext";

export { buildInitialPersona };
export type { Persona };

interface Persona {
  budget: number;
  carbonFootprint: number;
  actionPoints: number;
  points: number;
  consumption: readonly ConsumptionDatum[];
  production: ProductionDatum[];
  materials: MaterialsDatum[];
}

const buildInitialPersona: (
  personalization: PersoForm,
  teamActions: TeamAction[]
) => Persona = (personalization: PersoForm, teamActions: TeamAction[]) => {
  const formattedPersonalization = fillPersonalization(personalization);
  const intermediateValues = computeIntermediateValues(
    formattedPersonalization
  );
  const consumption = getConsumptionFromProfile(
    formattedPersonalization,
    intermediateValues
  );

  const carbonProductionElectricMix =
    computeCarbonProductionElectricMix(production);
  const carbonFootprint = computeCarbonFootprint(
    carbonProductionElectricMix,
    consumption as ConsumptionDatum[]
  );

  const materials = computeMaterials(production, teamActions);

  const persona: Persona = {
    budget: 13.7,
    actionPoints: 0,
    points: 0,
    carbonFootprint,
    consumption,
    production,
    materials,
  };

  return persona;
};
