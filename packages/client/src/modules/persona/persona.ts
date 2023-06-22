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
  computeMetals,
  PhysicalResourceNeedDatum,
} from "../play/gameEngines/resourcesEngine";
import { ProductionAction, TeamAction } from "../../utils/types";

export { buildInitialPersona };
export type { Persona };

interface Persona {
  budget: number;
  carbonFootprint: number;
  actionPoints: number;
  points: number;
  consumption: readonly ConsumptionDatum[];
  production: ProductionDatum[];
  materials: PhysicalResourceNeedDatum[];
  metals: PhysicalResourceNeedDatum[];
}

const buildInitialPersona = (
  personalization: PersoForm,
  teamActions: TeamAction[],
  productionActionById: Record<number, ProductionAction>
): Persona => {
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

  const materials = computeMaterials(
    production,
    teamActions,
    productionActionById
  );
  const metals = computeMetals(production, teamActions, productionActionById);

  const persona: Persona = {
    budget: 13.7,
    actionPoints: 0,
    points: 0,
    carbonFootprint,
    consumption,
    production,
    materials,
    metals,
  };

  return persona;
};
